import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';

// Form field definitions for each sheet type
const formFields = {
    order_booked: [
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true },
        { name: 'opportunity_name', label: 'Opportunity Name', type: 'text', required: true },
        { name: 'products_services', label: 'Products/Services', type: 'textarea', required: false },
        { name: 'mrr', label: 'MRR', type: 'number', required: false },
        { name: 'acv', label: 'ACV', type: 'number', required: false },
        { name: 'otc', label: 'OTC', type: 'number', required: false },
        { name: 'project_tenure', label: 'Project Tenure', type: 'text', required: false },
        { name: 'tcv', label: 'TCV', type: 'number', required: false },
        { name: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'], required: false },
        { name: 'stage_description', label: 'Stage Description', type: 'text', required: false },
        { name: 'probability', label: 'Probability %', type: 'number', required: false },
        { name: 'expected_closer_date', label: 'Expected Closer Date', type: 'date', required: false },
        { name: 'quarter', label: 'Quarter', type: 'select', options: ['Q1', 'Q2', 'Q3', 'Q4'], required: false },
        { name: 'sales_type', label: 'Sales Type', type: 'select', options: ['Net New', 'Upsell', 'Existing'], required: false },
    ],
    payment_collection: [
        { name: 'sales_person_name', label: 'Sales Person Name', type: 'text', required: true },
        { name: 'client_id', label: 'Client ID', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true },
        { name: 'invoice_amount', label: 'Invoice Amount', type: 'number', required: true },
        { name: 'received_amount', label: 'Received Amount', type: 'number', required: true },
        { name: 'tds', label: 'TDS', type: 'number', required: false },
    ],
    funnel: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'opportunity_owner_name', label: 'Opportunity Owner Name', type: 'text', required: true },
        { name: 'organisation_name', label: 'Organisation Name', type: 'text', required: true },
        { name: 'partner_organisation', label: 'Partner Organisation', type: 'text', required: false },
        { name: 'what_selling', label: 'What are we selling', type: 'textarea', required: false },
        { name: 'opportunity_id', label: 'Opportunity Id', type: 'text', required: false },
        { name: 'tender_type', label: 'Tender/Non Tender', type: 'select', options: ['Tender', 'Non Tender'], required: false },
        { name: 'sales_stages', label: 'Sales Stages', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5'], required: false },
        { name: 'contact_name', label: 'Contact Name', type: 'text', required: false },
        { name: 'email', label: 'Email', type: 'email', required: false },
        { name: 'remark', label: 'Remark', type: 'textarea', required: false },
    ],
    proposal_submitted: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'pot_id', label: 'POT ID', type: 'text', required: true },
        { name: 'source', label: 'Source', type: 'select', options: ['Direct', 'Channel', 'Alliance', 'Partner'], required: false },
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true },
        { name: 'opportunity_name', label: 'Opportunity Name', type: 'text', required: true },
        { name: 'mrr', label: 'MRR', type: 'number', required: false },
        { name: 'acv', label: 'ACV', type: 'number', required: false },
        { name: 'otc', label: 'OTC', type: 'number', required: false },
        { name: 'project_tenure', label: 'Project Tenure', type: 'text', required: false },
        { name: 'tcv', label: 'TCV', type: 'number', required: false },
        { name: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'], required: false },
        { name: 'stage_description', label: 'Stage Description', type: 'text', required: false },
        { name: 'probability', label: 'Probability %', type: 'number', required: false },
        { name: 'sales_type', label: 'Sales Type', type: 'select', options: ['Net New', 'Upsell', 'Existing'], required: false },
        { name: 'industry', label: 'Industry', type: 'text', required: false },
        { name: 'region', label: 'Region', type: 'text', required: false },
        { name: 'channel_manager', label: 'Channel Manager', type: 'text', required: false },
        { name: 'remark', label: 'Remark', type: 'textarea', required: false },
        { name: 'latest_remark', label: 'Latest Remark', type: 'textarea', required: false },
    ],
    demos: [
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true },
        { name: 'demo_product_name', label: 'Demo Product Name', type: 'text', required: true },
        { name: 'sales_stage', label: 'Sales Stage', type: 'select', options: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'], required: false },
        { name: 'stage_description', label: 'Stage Description', type: 'text', required: false },
        { name: 'probability', label: 'Probability %', type: 'number', required: false },
        { name: 'region', label: 'Region', type: 'text', required: false },
        { name: 'client_spoc', label: 'Client Spoc', type: 'text', required: false },
        { name: 'contact_no', label: 'Contact No.', type: 'tel', required: false },
        { name: 'email_id', label: 'Email ID', type: 'email', required: false },
    ],
    partner_on_board: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name/Account Name', type: 'text', required: true },
        { name: 'products', label: 'Products', type: 'text', required: true },
        { name: 'remark', label: 'Remark', type: 'textarea', required: false },
        { name: 'contact_person_name', label: 'Contact Person Name', type: 'text', required: false },
        { name: 'contact_no', label: 'Contact No', type: 'tel', required: false },
        { name: 'email_id', label: 'Email ID', type: 'email', required: false },
    ],
    dc_visit: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'account_client_name', label: 'Account/Client Name', type: 'text', required: true },
        { name: 'product_pitched_in', label: 'Product Pitched in', type: 'text', required: true },
        { name: 'sector', label: 'Sector', type: 'text', required: true },
        { name: 'region', label: 'Region', type: 'text', required: true },
        { name: 'contact_person', label: 'Contact Person', type: 'text', required: false },
        { name: 'email_id', label: 'Email ID', type: 'email', required: false },
        { name: 'mobile_number', label: 'Mobile Number', type: 'tel', required: false },
    ],
    client_direct_visit: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true },
        { name: 'products_services_pitched', label: 'Products/Services Pitched', type: 'text', required: true },
        { name: 'industry', label: 'Industry', type: 'text', required: true },
        { name: 'region', label: 'Region', type: 'text', required: true },
    ],
    events_attend: [
        { name: 'sales_person', label: 'Sales Person', type: 'text', required: true },
        { name: 'event_name', label: 'Event Name', type: 'text', required: true },
        { name: 'organised_by', label: 'Organised by', type: 'text', required: false },
        { name: 'topic', label: 'Topic', type: 'text', required: false },
        { name: 'venue', label: 'Venue', type: 'text', required: false },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'to', label: 'To', type: 'date', required: false },
        { name: 'total_client_visited', label: 'Total Client Visited', type: 'number', required: false },
        { name: 'total_delegates_attended', label: 'Total Delegates Attended', type: 'number', required: false },
    ],
    daily_report: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'employee_name', label: 'Employee Name', type: 'text', required: true },
        { name: 'leads_received_from', label: 'Leads Received From', type: 'text', required: false },
        { name: 'nature', label: 'Nature', type: 'text', required: false },
        { name: 'new_existing_lead', label: 'New/Existing Lead', type: 'select', options: ['New', 'Existing'], required: false },
        { name: 'tender_opportunity_details', label: 'Tender/Opportunity Details', type: 'textarea', required: false },
        { name: 'bank_company_name', label: 'Bank/Company Name', type: 'text', required: false },
        { name: 'solutions_products', label: 'Solutions/Products', type: 'text', required: false },
        { name: 'person_name', label: 'Person Name', type: 'text', required: false },
        { name: 'designation', label: 'Designation', type: 'text', required: false },
        { name: 'contact_no', label: 'Contact No', type: 'tel', required: false },
        { name: 'email_id', label: 'Email Id', type: 'email', required: false },
        { name: 'address', label: 'Address', type: 'textarea', required: false },
        { name: 'state', label: 'State', type: 'text', required: false },
        { name: 'product_interested_in', label: 'Product Interested In', type: 'text', required: false },
        { name: 'next_action', label: 'Next Action', type: 'text', required: false },
        { name: 'next_follow_up_date', label: 'Next Follow up Date', type: 'date', required: false },
    ],
    tender: [
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'pot_id', label: 'POT Id', type: 'text', required: true },
        { name: 'who_working', label: 'Who Working', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'url', required: false },
        { name: 'customer_name', label: 'Customer Name', type: 'text', required: true },
        { name: 'tender_name', label: 'Tender Name', type: 'text', required: true },
        { name: 'published_date', label: 'Published Date', type: 'date', required: false },
        { name: 'last_date_purchase_rfp', label: 'Last Date Purchase RFP', type: 'date', required: false },
        { name: 'last_date_submit_pre_bid', label: 'Last Date Submit Pre Bid Queries', type: 'date', required: false },
        { name: 'pre_bid_date', label: 'Pre-Bid Date', type: 'date', required: false },
        { name: 'submission_date', label: 'Submission Date', type: 'date', required: false },
        { name: 'technical_tender_opening', label: 'Technical Tender Opening Date', type: 'date', required: false },
        { name: 'commercial_tender_opening', label: 'Commercial Tender Opening Date', type: 'date', required: false },
        { name: 'tender_fee', label: 'Tender Fee', type: 'number', required: false },
        { name: 'emd', label: 'EMD', type: 'number', required: false },
        { name: 'bank_guarantee_percentage', label: 'Bank Guarantee Percentage', type: 'number', required: false },
        { name: 'contact_person', label: 'Contact Person', type: 'text', required: false },
        { name: 'contact_no', label: 'Contact No.', type: 'tel', required: false },
        { name: 'email_id', label: 'Email ID', type: 'email', required: false },
        { name: 'submission_address', label: 'Submission Address', type: 'textarea', required: false },
        { name: 'account_manager', label: 'Account Manager', type: 'text', required: false },
        { name: 'submitted', label: 'Submitted (Yes/No)', type: 'select', options: ['Yes', 'No'], required: false },
        { name: 'not_submitted_remark', label: 'if Not Submitted Remark', type: 'textarea', required: false },
    ],
};

const AddDataForm = ({ sheetType, onSubmit, onCancel, initialData = null, isEdit = false }) => {
    const fields = formFields[sheetType] || [];
    const [formData, setFormData] = useState(initialData || {});
    const [errors, setErrors] = useState({});

    const handleChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        // Clear error when user types
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (isEdit) {
                onSubmit(formData);
            } else {
                const newRecord = {
                    sr_no: Date.now(),
                    ...formData,
                };
                onSubmit(newRecord);
            }
            setFormData({});
        }
    };

    const getSheetTitle = () => {
        const titles = {
            order_booked: 'Order Booked',
            payment_collection: 'Payment Collection',
            funnel: 'Sales Funnel List',
            proposal_submitted: 'Proposal Submitted',
            demos: 'Demo',
            partner_on_board: 'Partner on Board',
            dc_visit: 'DC Visit',
            client_direct_visit: 'Client Direct Visit',
            events_attend: 'Events Attend',
            daily_report: 'Daily Report',
            tender: 'Tender',
        };
        return titles[sheetType] || 'Add Data';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn overflow-y-auto">
            <div className="glass rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl border-2 border-white/20 my-2 sm:my-4 md:my-8 animate-scaleIn max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-white/20 sticky top-0 bg-white/70 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex-shrink-0">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">{isEdit ? 'Edit Record' : 'Add New Record'}</h2>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{getSheetTitle()} • {fields.length} fields</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg transition-all flex-shrink-0 ml-2 touch-manipulation"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                            {fields.map((field) => (
                                <div key={field.name} className={`${field.type === 'textarea' ? 'col-span-full' : ''}`}>
                                    <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>

                                    {field.type === 'select' ? (
                                        <select
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm sm:text-base touch-manipulation ${errors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            rows={3}
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm sm:text-base touch-manipulation resize-y ${errors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            placeholder={`Enter ${field.label}`}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm sm:text-base touch-manipulation ${errors[field.name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            placeholder={`Enter ${field.label}`}
                                        />
                                    )}

                                    {errors[field.name] && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 sm:pt-6 border-t border-gray-200 sticky bottom-0 bg-white/70 backdrop-blur-md">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all text-sm sm:text-base touch-manipulation"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                            >
                                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                {isEdit ? 'Update Record' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDataForm;
