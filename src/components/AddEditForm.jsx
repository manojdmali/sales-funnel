import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const AddEditForm = ({ sheetType, editData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const formConfigs = {
        order_booked: {
            title: 'Order Booked',
            fields: [
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'opportunity_name', label: 'Opportunity Name', type: 'text', required: true },
                { key: 'products_services', label: 'Products/Services', type: 'textarea' },
                { key: 'mrr', label: 'MRR', type: 'number', step: '0.01' },
                { key: 'acv', label: 'ACV', type: 'number', step: '0.01' },
                { key: 'otc', label: 'OTC', type: 'number', step: '0.01' },
                { key: 'project_tenure', label: 'Project Tenure', type: 'text' },
                { key: 'tcv', label: 'TCV', type: 'number', step: '0.01' },
                { key: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] },
                { key: 'stage_description', label: 'Stage Description', type: 'text' },
                { key: 'probability', label: 'Probability %', type: 'number', min: 0, max: 100 },
                { key: 'expected_closer_date', label: 'Expected Closer Date', type: 'date' },
                { key: 'quarter', label: 'Quarter', type: 'select', options: ['Q1', 'Q2', 'Q3', 'Q4'] },
                { key: 'sales_type', label: 'Sales Type', type: 'select', options: ['Net New', 'Upsell', 'Existing'] }
            ]
        },
        payment_collection: {
            title: 'Payment Collection',
            fields: [
                { key: 'sales_person_name', label: 'Sales Person Name', type: 'text', required: true },
                { key: 'client_id', label: 'Client ID', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'invoice_amount', label: 'Invoice Amount', type: 'number', step: '0.01', required: true },
                { key: 'received_amount', label: 'Received Amount', type: 'number', step: '0.01', required: true },
                { key: 'tds', label: 'TDS', type: 'number', step: '0.01' }
            ]
        },
        funnel: {
            title: 'Funnel',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'opportunity_owner_name', label: 'Opportunity Owner Name', type: 'text', required: true },
                { key: 'organisation_name', label: 'Organisation Name', type: 'text', required: true },
                { key: 'partner_organisation', label: 'Partner Organisation', type: 'text' },
                { key: 'what_selling', label: 'What are we selling', type: 'textarea' },
                { key: 'opportunity_id', label: 'Opportunity Id', type: 'text' },
                { key: 'tender_type', label: 'Tender/Non Tender', type: 'select', options: ['Tender', 'Non Tender'] },
                { key: 'sales_stages', label: 'Sales Stages', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5'] },
                { key: 'contact_name', label: 'Contact Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'remark', label: 'Remark', type: 'textarea' }
            ]
        },
        proposal_submitted: {
            title: 'Proposal Submitted',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'pot_id', label: 'POT ID', type: 'text', required: true },
                { key: 'source', label: 'Source', type: 'select', options: ['Direct', 'Channel', 'Alliance', 'Partner'] },
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'opportunity_name', label: 'Opportunity Name', type: 'text', required: true },
                { key: 'mrr', label: 'MRR', type: 'number', step: '0.01' },
                { key: 'acv', label: 'ACV', type: 'number', step: '0.01' },
                { key: 'otc', label: 'OTC', type: 'number', step: '0.01' },
                { key: 'project_tenure', label: 'Project Tenure', type: 'text' },
                { key: 'tcv', label: 'TCV', type: 'number', step: '0.01' },
                { key: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] },
                { key: 'stage_description', label: 'Stage Description', type: 'text' },
                { key: 'probability', label: 'Probability %', type: 'number', min: 0, max: 100 },
                { key: 'sales_type', label: 'Sales Type', type: 'select', options: ['Net New', 'Upsell', 'Existing'] },
                { key: 'industry', label: 'Industry', type: 'text' },
                { key: 'region', label: 'Region', type: 'text' },
                { key: 'channel_manager', label: 'Channel Manager', type: 'text' },
                { key: 'remark', label: 'Remark', type: 'textarea' },
                { key: 'latest_remark', label: 'Latest Remark', type: 'textarea' }
            ]
        },
        demos: {
            title: 'Demo',
            fields: [
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'demo_product_name', label: 'Demo Product Name', type: 'text', required: true },
                { key: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] },
                { key: 'stage_description', label: 'Stage Description', type: 'text' },
                { key: 'probability', label: 'Probability %', type: 'number', min: 0, max: 100 },
                { key: 'region', label: 'Region', type: 'text' },
                { key: 'client_spoc', label: 'Client Spoc', type: 'text' },
                { key: 'contact_no', label: 'Contact No.', type: 'tel' },
                { key: 'email_id', label: 'Email ID', type: 'email' }
            ]
        },
        partner_on_board: {
            title: 'Partner on Board',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'products', label: 'Products', type: 'text' },
                { key: 'remark', label: 'Remark', type: 'textarea' },
                { key: 'contact_person_name', label: 'Contact Person Name', type: 'text' },
                { key: 'contact_no', label: 'Contact No', type: 'tel' },
                { key: 'email_id', label: 'Email ID', type: 'email' }
            ]
        },
        dc_visit: {
            title: 'DC Visit',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'account_client_name', label: 'Account/Client Name', type: 'text', required: true },
                { key: 'product_pitched_in', label: 'Product Pitched in', type: 'text' },
                { key: 'sector', label: 'Sector', type: 'text' },
                { key: 'region', label: 'Region', type: 'text' },
                { key: 'contact_person', label: 'Contact Person', type: 'text' },
                { key: 'email_id', label: 'Email ID', type: 'email' },
                { key: 'mobile_number', label: 'Mobile Number', type: 'tel' }
            ]
        },
        client_direct_visit: {
            title: 'Client Direct Visit',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'client_name', label: 'Client Name', type: 'text', required: true },
                { key: 'products_services_pitched', label: 'Products/Services Pitched', type: 'textarea' },
                { key: 'industry', label: 'Industry', type: 'text' },
                { key: 'region', label: 'Region', type: 'text' }
            ]
        },
        events_attend: {
            title: 'Events Attend',
            fields: [
                { key: 'sales_person', label: 'Sales Person', type: 'text', required: true },
                { key: 'event_name', label: 'Event Name', type: 'text', required: true },
                { key: 'organised_by', label: 'Organised by', type: 'text' },
                { key: 'topic', label: 'Topic', type: 'text' },
                { key: 'venue', label: 'Venue', type: 'text' },
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'to', label: 'To', type: 'date' },
                { key: 'total_client_visited', label: 'Total Client Visited', type: 'number', min: 0 },
                { key: 'total_delegates_attended', label: 'Total Delegates Attended', type: 'number', min: 0 }
            ]
        },
        tender: {
            title: 'Tender',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'pot_id', label: 'POT Id', type: 'text', required: true },
                { key: 'who_working', label: 'Who Working', type: 'text' },
                { key: 'url', label: 'URL', type: 'url' },
                { key: 'customer_name', label: 'Customer Name', type: 'text', required: true },
                { key: 'tender_name', label: 'Tender Name', type: 'text', required: true },
                { key: 'published_date', label: 'Published Date', type: 'date' },
                { key: 'last_date_purchase_rfp', label: 'Last Date Purchase RFP', type: 'date' },
                { key: 'last_date_submit_pre_bid', label: 'Last Date Submit Pre Bid Queries', type: 'date' },
                { key: 'pre_bid_date', label: 'Pre-Bid Date', type: 'date' },
                { key: 'submission_date', label: 'Submission Date', type: 'date' },
                { key: 'technical_tender_opening', label: 'Technical Tender Opening Date', type: 'date' },
                { key: 'commercial_tender_opening', label: 'Commercial Tender Opening Date', type: 'date' },
                { key: 'tender_fee', label: 'Tender Fee', type: 'number', step: '0.01' },
                { key: 'emd', label: 'EMD', type: 'number', step: '0.01' },
                { key: 'bank_guarantee_percentage', label: 'Bank Guarantee Percentage', type: 'number', min: 0, max: 100 },
                { key: 'contact_person', label: 'Contact Person', type: 'text' },
                { key: 'contact_no', label: 'Contact No.', type: 'tel' },
                { key: 'email_id', label: 'Email ID', type: 'email' },
                { key: 'submission_address', label: 'Submission Address', type: 'textarea' },
                { key: 'account_manager', label: 'Account Manager', type: 'text' },
                { key: 'submitted', label: 'Submitted (Yes/No)', type: 'select', options: ['Yes', 'No'] },
                { key: 'not_submitted_remark', label: 'if Not Submitted Remark', type: 'textarea' }
            ]
        },
        daily_report: {
            title: 'Daily Report',
            fields: [
                { key: 'date', label: 'Date', type: 'date', required: true },
                { key: 'employee_name', label: 'Employee Name', type: 'text', required: true },
                { key: 'leads_received_from', label: 'Leads Received From', type: 'text' },
                { key: 'nature', label: 'Nature', type: 'text' },
                { key: 'new_existing_lead', label: 'New/Existing Lead', type: 'select', options: ['New', 'Existing'] },
                { key: 'tender_opportunity_details', label: 'Tender/Opportunity Details', type: 'textarea' },
                { key: 'bank_company_name', label: 'Bank/Company Name', type: 'text' },
                { key: 'solutions_products', label: 'Solutions/Products', type: 'text' },
                { key: 'person_name', label: 'Person Name', type: 'text' },
                { key: 'designation', label: 'Designation', type: 'text' },
                { key: 'contact_no', label: 'Contact No', type: 'tel' },
                { key: 'email_id', label: 'Email Id', type: 'email' },
                { key: 'address', label: 'Address', type: 'textarea' },
                { key: 'state', label: 'State', type: 'text' },
                { key: 'product_interested_in', label: 'Product Interested In', type: 'text' },
                { key: 'next_action', label: 'Next Action', type: 'text' },
                { key: 'next_follow_up_date', label: 'Next Follow up Date', type: 'date' }
            ]
        }
    };

    const config = formConfigs[sheetType];

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            const initialData = {};
            config?.fields.forEach(field => {
                initialData[field.key] = field.type === 'number' ? 0 : '';
            });
            setFormData(initialData);
        }
    }, [editData, sheetType]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        config.fields.forEach(field => {
            if (field.required && (!formData[field.key] || formData[field.key] === '')) {
                newErrors[field.key] = `${field.label} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.key,
            value: formData[field.key] || '',
            onChange: (e) => handleChange(field.key, e.target.value),
            className: `w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation ${
                errors[field.key] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
            }`
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} rows={3} />;
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
            case 'number':
                return (
                    <input
                        {...commonProps}
                        type="number"
                        step={field.step}
                        min={field.min}
                        max={field.max}
                    />
                );
            default:
                return <input {...commonProps} type={field.type || 'text'} />;
        }
    };

    if (!config) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl my-2 sm:my-4 max-h-[95vh] overflow-hidden flex flex-col">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6 rounded-t-xl sm:rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                {editData ? <Save className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                    {editData ? 'Edit' : 'Add'} {config.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {config.fields.length} fields
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2 touch-manipulation"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                            {config.fields.map(field => (
                                <div key={field.key} className={`${field.type === 'textarea' ? 'col-span-full' : ''}`}>
                                    <label htmlFor={field.key} className="block text-sm sm:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {renderField(field)}
                                    {errors[field.key] && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[field.key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base touch-manipulation"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                            >
                                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                {editData ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEditForm;