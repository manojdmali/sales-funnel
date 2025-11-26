import * as XLSX from 'xlsx';

/**
 * Validate Excel file before processing
 * @param {File} file - Excel file to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateExcelFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        return { valid: false, error: 'Please select a valid Excel file (.xlsx or .xls)' };
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }
    
    return { valid: true };
};

/**
 * Parse Excel file and extract data from all sheets
 * @param {File} file - Excel file to parse
 * @returns {Promise<Object>} Parsed data with sheet information
 */
export const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const parsedData = {
                    filename: file.name,
                    size: file.size,
                    uploadDate: new Date().toISOString(),
                    sheets: []
                };

                // Process each sheet (skip Target Ass-Target Achieved)
                workbook.SheetNames.forEach(sheetName => {
                    // Skip the Target Ass-Target Achieved sheet
                    if (sheetName.toLowerCase().includes('target ass') ||
                        sheetName.toLowerCase().includes('target achieved')) {
                        return;
                    }

                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                    if (jsonData.length > 0) {
                        const headers = jsonData[0];
                        const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

                        parsedData.sheets.push({
                            name: sheetName,
                            headers: headers,
                            totalRows: rows.length,
                            totalColumns: headers.length,
                            preview: rows.slice(0, 10).map(row => {
                                const rowData = {};
                                headers.forEach((header, index) => {
                                    rowData[header] = row[index];
                                });
                                return rowData;
                            }),
                            allData: rows.map(row => {
                                const rowData = {};
                                headers.forEach((header, index) => {
                                    rowData[header] = row[index];
                                });
                                return rowData;
                            })
                        });
                    }
                });

                resolve(parsedData);
            } catch (error) {
                reject(new Error(`Failed to parse Excel file: ${error.message}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsArrayBuffer(file);
    });
};

export const transformToDashboardFormat = (parsedData) => {
    const findSheet = (names) => {
        return parsedData.sheets.find(sheet =>
            names.some(name => sheet.name.toLowerCase().includes(name.toLowerCase()))
        );
    };

    // Find all sheets by common names
    const orderBookedSheet = findSheet(['order booked', 'order', 'orders']);
    const paymentCollectionSheet = findSheet(['payment collection', 'payment', 'collections']);
    const funnelSheet = findSheet(['funnel']);
    const proposalSheet = findSheet(['proposal submitted', 'proposal', 'proposals']);
    const demoSheet = findSheet(['demo', 'demos']);
    const partnerSheet = findSheet(['partner on board', 'partner', 'partners']);
    const dcVisitSheet = findSheet(['dc visit', 'dc visits', 'data center']);
    const visitSheet = findSheet(['client direct visit', 'client visit', 'visits']);
    const eventsSheet = findSheet(['events attend', 'events', 'event']);
    const tenderSheet = findSheet(['tender']);
    const dailyReportSheet = findSheet(['daily report', 'daily', 'report']);

    // Helper to normalize field names
    const normalizeFieldName = (name) => {
        return String(name || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    };

    // Helper to clean and parse numeric values
    const parseNumber = (value) => {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return value;
        // Remove commas, currency symbols, and other non-numeric characters
        const cleaned = String(value).replace(/[₹$,\s]/g, '').trim();
        const number = parseFloat(cleaned);
        return isNaN(number) ? 0 : number;
    };

    // Helper to clean and  format dates
    const parseDate = (value) => {
        if (!value) return null;
        if (value instanceof Date) return value.toISOString().split('T')[0];
        // Handle Excel serial dates
        if (typeof value === 'number') {
            const date = new Date((value - (25567 + 2)) * 86400 * 1000);
            return date.toISOString().split('T')[0];
        }
        return value;
    };

    // Helper to clean string values
    const cleanString = (value) => {
        if (value === null || value === undefined) return '';
        return String(value).trim();
    };

    // Helper to get value by multiple possible field names
    const getFieldValue = (row, possibleNames) => {
        for (const name of possibleNames) {
            if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                return row[name];
            }
        }
        return null;
    };

    // Enhanced generic processor with type handling
    const processGenericSheet = (sheet, customMapping = {}) => {
        if (!sheet) return [];
        return sheet.allData.map((row, idx) => {
            const processed = { sr_no: idx + 1 };
            Object.keys(row).forEach(key => {
                if (key && row[key] !== null && row[key] !== undefined) {
                    const normalizedKey = normalizeFieldName(key);
                    const finalKey = customMapping[normalizedKey] || normalizedKey;

                    // Smart type detection and conversion
                    let value = row[key];
                    if (typeof value === 'string') {
                        value = value.trim();
                        // Auto-convert numeric strings
                        if (normalizedKey.includes('amount') || normalizedKey.includes('value') ||
                            normalizedKey.includes('mrr') || normalizedKey.includes('acv') ||
                            normalizedKey.includes('tcv') || normalizedKey.includes('otc')) {
                            value = parseNumber(value);
                        }
                    }
                    processed[finalKey] = value;
                }
            });
            return processed;
        });
    };

    // Process Order Booked with exact field mapping
    const orderBooked = orderBookedSheet ? orderBookedSheet.allData.map((row, idx) => {
        const fieldMap = {
            'sales_person': ['Sales person'],
            'client_name': ['Client Name/ Account Name'],
            'opportunity_name': ['Opportunity name'],
            'products_services': ['Products/ Services Pitched'],
            'mrr': ['MRR (Cr.)'],
            'acv': ['ACV (Cr.)'],
            'otc': ['OTC (Cr.)'],
            'project_tenure': ['Project Tenure'],
            'tcv': ['TCV (Cr.)'],
            'sales_stage': ['Sales Stage\n(L1-L6)', 'Sales Stage (L1-L6)'],
            'stage_description': ['Stage Description'],
            'probability': ['Probability %'],
            'expected_closer_date': ['Expected Closer Date'],
            'quarter': ['QuarterQ1-Q4)', 'Quarter'],
            'sales_type': ['Sales Type:\n Net New, Upsell, Existing', 'Sales Type']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key.includes('amount') || key.includes('value')) {
                result[key] = parseNumber(result[key]);
            } else if (key.includes('date')) {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Payment Collection with exact mapping
    const paymentCollection = paymentCollectionSheet ? paymentCollectionSheet.allData.map((row, idx) => {
        const fieldMap = {
            'sales_person_name': ['Sales Person Name'],
            'client_id': ['Client ID'],
            'client_name': ['Client Name'],
            'invoice_amount': ['Invoice Amount'],
            'received_amount': ['Received Amount'],
            'tds': ['TDS']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key.includes('amount') || key.includes('deduction') || key.includes('payment')) {
                result[key] = parseNumber(result[key]);
            } else if (key.includes('date')) {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Funnel with exact mapping
    const funnel = funnelSheet ? funnelSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'opportunity_owner_name': ['Opportunity Owner Name'],
            'organisation_name': ['Organisation Name'],
            'partner_organisation': ['If Partner Involved, mention Partner Organisation Name'],
            'what_selling': ['What are we selling here'],
            'opportunity_id': ['Opportunity Id'],
            'tender_type': ['Tender/ Non Tender'],
            'sales_stages': ['Sales Stages (L1 to L5)'],
            'contact_name': ['Contant Name', 'Contact Name'],
            'email': ['Email'],
            'remark': ['Remark']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (['mrr', 'acv', 'otc', 'tcv'].includes(key)) {
                result[key] = parseNumber(result[key]);
            } else if (key === 'probability') {
                result[key] = parseNumber(result[key]);
            } else if (key === 'date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process proposals - using Funnel data as proposals
    const proposals = funnel; // Funnel sheet contains proposal data

    // Process Proposal Submitted sheet with exact mapping
    const proposalSubmitted = proposalSheet ? proposalSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'pot_id': ['POT ID'],
            'source': ['Source- \nDirect/ Channel/Alliance/Partner', 'Source'],
            'sales_person': ['Sales person'],
            'client_name': ['Client Name/ Account Name'],
            'opportunity_name': ['Opportunity name'],
            'mrr': ['MRR'],
            'acv': ['ACV'],
            'otc': ['OTC'],
            'project_tenure': ['Project Tenure'],
            'tcv': ['TCV'],
            'sales_stage': ['Sales Stage\n(L1-L6)', 'Sales Stage (L1-L6)'],
            'stage_description': ['Stage Description'],
            'probability': ['Probability %'],
            'sales_type': ['Sales Type:\n Net New, Upsell, Existing', 'Sales Type'],
            'industry': ['Industry'],
            'region': ['Region'],
            'channel_manager': ['Channel/Allaince \nmanager Name', 'Channel Manager'],
            'remark': ['Remark'],
            'latest_remark': ['Latest Remark']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (['mrr', 'acv', 'otc', 'tcv', 'probability'].includes(key)) {
                result[key] = parseNumber(result[key]);
            } else if (key === 'date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process demos with exact mapping
    const demos = demoSheet ? demoSheet.allData.map((row, idx) => {
        const fieldMap = {
            'sales_person': ['Sales person'],
            'client_name': ['Client Name/ Account Name'],
            'demo_product_name': ['Demo Product Name'],
            'sales_stage': ['Sales Stage\n(L1-L6)', 'Sales Stage (L1-L6)'],
            'stage_description': ['Stage Description'],
            'probability': ['Probability %'],
            'region': ['Region'],
            'client_spoc': ['Name of Client Spoc /  Email ID & Contact Number'],
            'contact_no': ['Contact no.'],
            'email_id': ['Email id']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key === 'date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Partner on board with exact mapping
    const partners = partnerSheet ? partnerSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'sales_person': ['Sales person'],
            'client_name': ['Client Name/ Account Name'],
            'products': ['Products'],
            'remark': ['Remark'],
            'contact_person_name': ['Contact Person name'],
            'contact_no': ['Conatct no', 'Contact no'],
            'email_id': ['Email id']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key === 'date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process client visits with exact mapping
    const visits = visitSheet ? visitSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'sales_person': ['Sales person'],
            'client_name': ['Client Name/ Account Name'],
            'products_services_pitched': ['Products/ Services Pitched'],
            'industry': ['Industry'],
            'region': ['Region']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key.includes('date')) {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process DC visits with exact mapping
    const dcVisits = dcVisitSheet ? dcVisitSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'sales_person': ['Sales Person'],
            'account_client_name': ['Account /Client Name'],
            'product_pitched_in': ['Product Pitched in'],
            'sector': ['Sector'],
            'region': ['Region'],
            'contact_person': ['Contact person'],
            'email_id': ['Email Id'],
            'mobile_number': ['Mobile number']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key === 'date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Events Attend with exact mapping
    const events = eventsSheet ? eventsSheet.allData.map((row, idx) => {
        const fieldMap = {
            'sales_person': ['Sales person'],
            'event_name': ['Event Name'],
            'organised_by': ['Organisaed by', 'Organised by'],
            'topic': ['Topic'],
            'venue': ['Venue'],
            'date': ['Date'],
            'to': ['To'],
            'total_client_visited': ['Total Client Visited'],
            'total_delegates_attended': ['Total Delegates Attended']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key === 'date' || key === 'to') {
                result[key] = parseDate(result[key]);
            } else if (key.includes('total')) {
                result[key] = parseNumber(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Tender with exact mapping
    const tender = tenderSheet ? tenderSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'pot_id': ['POT Id'],
            'who_working': ['Who Working'],
            'url': ['URL'],
            'customer_name': ['Customer Name'],
            'tender_name': ['Tender Name'],
            'published_date': ['Published Date'],
            'last_date_purchase_rfp': ['Last Date Purchase RFP'],
            'last_date_submit_pre_bid': ['Last Date Submit Pre Bid Queries'],
            'pre_bid_date': ['Pre-Bid Date'],
            'submission_date': ['Submission Date'],
            'technical_tender_opening': ['Technical Tender Opening Date'],
            'commercial_tender_opening': ['Commercial Tender Opening Date'],
            'tender_fee': ['Tender Fee'],
            'emd': ['EMD'],
            'bank_guarantee_percentage': ['Bank Guarntee Percentage'],
            'contact_person': ['Contact Person'],
            'contact_no': ['Contact No.'],
            'email_id': ['Email ID'],
            'submission_address': ['Submission Address'],
            'account_manager': ['Account Manager'],
            'submitted': ['Submitted (Yes/No)'],
            'not_submitted_remark': ['if Not Submitted Remark']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key.includes('date')) {
                result[key] = parseDate(result[key]);
            } else if (key === 'tender_fee' || key === 'emd') {
                result[key] = parseNumber(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Process Daily Report with exact mapping
    const dailyReport = dailyReportSheet ? dailyReportSheet.allData.map((row, idx) => {
        const fieldMap = {
            'date': ['Date'],
            'employee_name': ['Employee Name'],
            'leads_received_from': ['Leads Received From'],
            'nature': ['Nature'],
            'new_existing_lead': ['New/Existing Lead'],
            'tender_opportunity_details': ['Tender / Opportunity Details'],
            'bank_company_name': ['Bank / Cr.Soc./Company Name'],
            'solutions_products': ['Solutions / Products'],
            'person_name': ['Person Name'],
            'designation': ['Designation'],
            'contact_no': ['Contact No'],
            'email_id': ['Email Id'],
            'address': ['Address'],
            'state': ['State'],
            'product_interested_in': ['Product Interested In'],
            'next_action': ['Next Action'],
            'next_follow_up_date': ['Next Follow up Date']
        };

        const result = { sr_no: idx + 1 };
        Object.keys(fieldMap).forEach(key => {
            result[key] = getFieldValue(row, fieldMap[key]);
            if (key === 'date' || key === 'next_follow_up_date') {
                result[key] = parseDate(result[key]);
            } else {
                result[key] = cleanString(result[key]);
            }
        });
        return result;
    }) : [];

    // Calculate enhanced KPIs with better aggregation
    const allProposals = proposalSubmitted.length > 0 ? proposalSubmitted : proposals;
    const totalTCV = allProposals.reduce((sum, p) => sum + (p.tcv || 0), 0);
    const totalRevenue = orderBooked.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalPaymentsReceived = paymentCollection.reduce((sum, p) => sum + (p.amount_received || 0), 0);
    const avgACV = allProposals.length > 0
        ? allProposals.reduce((sum, p) => sum + (p.acv || 0), 0) / allProposals.length
        : 0;
    const avgProbability = allProposals.length > 0
        ? allProposals.reduce((sum, p) => sum + (p.probability || 0), 0) / allProposals.length
        : 0;
    const avgDealSize = totalTCV > 0 && allProposals.length > 0 ? totalTCV / allProposals.length : 0;

    return {
        metadata: {
            report_name: 'Uploaded Sales Funnel Data',
            generated_at: new Date().toISOString(),
            source: 'excel_upload',
            filename: parsedData.filename,
            total_sheets: parsedData.sheets.length,
            processing_date: new Date().toLocaleDateString()
        },
        sheets: {
            order_booked: {
                sheet_name: 'Order Booked',
                total_records: orderBooked.length,
                data: orderBooked,
                summary: {
                    total_orders: orderBooked.length,
                    total_revenue: totalRevenue
                }
            },
            payment_collection: {
                sheet_name: 'Payment Collection',
                total_records: paymentCollection.length,
                data: paymentCollection,
                summary: {
                    total_payments: paymentCollection.length,
                    total_amount_received: totalPaymentsReceived
                }
            },
            funnel: {
                sheet_name: 'Funnel',
                total_records: funnel.length,
                data: funnel,
                summary: {
                    total_opportunities: funnel.length,
                    total_pipeline_value: funnel.reduce((sum, f) => sum + (f.tcv || 0), 0)
                }
            },
            proposal_submitted: {
                sheet_name: 'Proposal Submitted',
                total_records: proposalSubmitted.length > 0 ? proposalSubmitted.length : allProposals.length,
                data: proposalSubmitted.length > 0 ? proposalSubmitted : allProposals,
                summary: {
                    total_proposals: allProposals.length,
                    total_tcv: totalTCV,
                    avg_acv: avgACV,
                    avg_probability: avgProbability,
                    avg_deal_size: avgDealSize
                }
            },
            demos: {
                sheet_name: 'Demo',
                total_records: demos.length,
                data: demos
            },
            partner_on_board: {
                sheet_name: 'Partner on board',
                total_records: partners.length,
                data: partners
            },
            client_direct_visit: {
                sheet_name: 'Client Direct Visit',
                total_records: visits.length,
                data: visits
            },
            dc_visit: {
                sheet_name: 'DC Visit',
                total_records: dcVisits.length,
                data: dcVisits
            },
            events_attend: {
                sheet_name: 'Events Attend',
                total_records: events.length,
                data: events
            },
            tender: {
                sheet_name: 'Tender',
                total_records: tender.length,
                data: tender
            },
            daily_report: {
                sheet_name: 'Daily Report',
                total_records: dailyReport.length,
                data: dailyReport
            }
        },
        kpis: {
            total_proposals: allProposals.length,
            total_demos_conducted: demos.length,
            total_client_visits: visits.length,
            total_dc_visits: dcVisits.length,
            total_orders_booked: orderBooked.length,
            total_payments: paymentCollection.length,
            total_partners: partners.length,
            total_events: events.length,
            total_tenders: tender.length,
            total_funnel_activities: allProposals.length + demos.length + visits.length + dcVisits.length + orderBooked.length + events.length + tender.length,
            revenue_metrics: {
                total_tcv: totalTCV,
                total_revenue: totalRevenue,
                total_payments_received: totalPaymentsReceived,
                outstanding_balance: totalRevenue - totalPaymentsReceived,
                avg_acv: avgACV,
                avg_deal_size: avgDealSize,
                avg_deal_probability: avgProbability,
                conversion_rate: orderBooked.length > 0 && allProposals.length > 0
                    ? (orderBooked.length / allProposals.length) * 100
                    : 0
            }
        }
    };
};
