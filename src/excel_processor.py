"""
Sales Funnel Report - Excel Data Processor
Processes Sandesh team funnel report and generates JSON dashboard data
"""

import pandas as pd
import json
from datetime import datetime
from typing import Dict, List, Any
import numpy as np

class SalesDataProcessor:
    def __init__(self, excel_path: str):
        self.excel_path = excel_path
        self.xls = pd.ExcelFile(excel_path)
        self.data = {}
        self.dashboard_data = {}
        
    def process_proposal_submitted(self) -> Dict[str, Any]:
        """Extract and process Proposal Submitted sheet"""
        df = pd.read_excel(self.excel_path, sheet_name='Proposal Submitted')
        
        proposals = []
        for idx, row in df.iterrows():
            proposal = {
                'sr_no': int(row['Sr. No']) if pd.notna(row['Sr. No']) else None,
                'date': str(row['Date']).split()[0] if pd.notna(row['Date']) else None,
                'pot_id': str(row['POT ID']) if pd.notna(row['POT ID']) else None,
                'source': str(row['Source- \nDirect/ Channel/Alliance/Partner']).strip() if pd.notna(row['Source- \nDirect/ Channel/Alliance/Partner']) else None,
                'sales_person': str(row['Sales person']).strip() if pd.notna(row['Sales person']) else None,
                'client_name': str(row['Client Name/ Account Name']).strip() if pd.notna(row['Client Name/ Account Name']) else None,
                'opportunity_name': str(row['Opportunity name']).strip() if pd.notna(row['Opportunity name']) else None,
                'mrr': float(row['MRR']) if pd.notna(row['MRR']) else 0,
                'acv': float(row['ACV']) if pd.notna(row['ACV']) else 0,
                'otc': float(row['OTC']) if pd.notna(row['OTC']) else 0,
                'tcv': float(row['TCV']) if pd.notna(row['TCV']) else 0,
                'sales_stage': str(row['Sales Stage\n(L1-L6)']).strip() if pd.notna(row['Sales Stage\n(L1-L6)']) else None,
                'probability': float(row['Probability %']) if pd.notna(row['Probability %']) else 0,
                'sales_type': str(row['Sales Type:\n Net New, Upsell, Existing']).strip() if pd.notna(row['Sales Type:\n Net New, Upsell, Existing']) else None,
                'industry': str(row['Industry']).strip() if pd.notna(row['Industry']) else None,
                'region': str(row['Region']).strip() if pd.notna(row['Region']) else None,
                'remark': str(row['Remark']) if pd.notna(row['Remark']) else None,
                'latest_remark': str(row['Latest Remark']) if pd.notna(row['Latest Remark']) else None,
            }
            proposals.append(proposal)
        
        return {
            'sheet_name': 'Proposal Submitted',
            'total_records': len(proposals),
            'data': proposals,
            'summary': self._get_proposal_summary(proposals)
        }
    
    def process_demo(self) -> Dict[str, Any]:
        """Extract and process Demo sheet"""
        df = pd.read_excel(self.excel_path, sheet_name='Demo', header=1)
        
        demos = []
        for idx, row in df.iterrows():
            if pd.notna(row.iloc[0]):  # If Sr. No exists
                demo = {
                    'sr_no': int(row.iloc[0]) if pd.notna(row.iloc[0]) else None,
                    'sales_person': str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else None,
                    'client_name': str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else None,
                    'contact_no': str(row.iloc[9]) if pd.notna(row.iloc[9]) else None,
                    'email': str(row.iloc[10]) if pd.notna(row.iloc[10]) else None,
                }
                demos.append(demo)
        
        return {
            'sheet_name': 'Demo',
            'total_records': len(demos),
            'data': demos
        }
    
    def process_client_direct_visit(self) -> Dict[str, Any]:
        """Extract and process Client Direct Visit sheet"""
        df = pd.read_excel(self.excel_path, sheet_name='Client Direct visit')
        
        visits = []
        for idx, row in df.iterrows():
            visit = {
                'sr_no': int(row['Sr. No']) if pd.notna(row['Sr. No']) else None,
                'date': str(row['Date']).split()[0] if pd.notna(row['Date']) else None,
                'sales_person': str(row['Sales person']).strip() if pd.notna(row['Sales person']) else None,
                'client_name': str(row['Client Name/ Account Name']).strip() if pd.notna(row['Client Name/ Account Name']) else None,
                'products_pitched': str(row['Products/ Services Pitched ']).strip() if pd.notna(row['Products/ Services Pitched ']) else None,
                'industry': str(row['Industry']).strip() if pd.notna(row['Industry']) else None,
                'region': str(row['Region']).strip() if pd.notna(row['Region']) else None,
            }
            visits.append(visit)
        
        return {
            'sheet_name': 'Client Direct Visit',
            'total_records': len(visits),
            'data': visits
        }
    
    def process_dc_visit(self) -> Dict[str, Any]:
        """Extract and process DC Visit sheet"""
        df = pd.read_excel(self.excel_path, sheet_name='DC visit')
        
        dc_visits = []
        for idx, row in df.iterrows():
            dc_visit = {
                'sr_no': int(row['Sr. No']) if pd.notna(row['Sr. No']) else None,
                'date': str(row['Date']).split()[0] if pd.notna(row['Date']) else None,
                'sales_person': str(row['Sales Person ']).strip() if pd.notna(row['Sales Person ']) else None,
                'account_name': str(row['Account /Client Name']).strip() if pd.notna(row['Account /Client Name']) else None,
                'product_pitched': str(row['Product Pitched in']).strip() if pd.notna(row['Product Pitched in']) else None,
                'sector': str(row['Sector']).strip() if pd.notna(row['Sector']) else None,
                'region': str(row['Region']).strip() if pd.notna(row['Region']) else None,
                'contact_person': str(row['Contact person']).strip() if pd.notna(row['Contact person']) else None,
                'mobile': str(row['Mobile number']) if pd.notna(row['Mobile number']) else None,
            }
            dc_visits.append(dc_visit)
        
        return {
            'sheet_name': 'DC Visit',
            'total_records': len(dc_visits),
            'data': dc_visits
        }
    
    def _get_proposal_summary(self, proposals: List[Dict]) -> Dict[str, Any]:
        """Generate summary statistics for proposals"""
        return {
            'total_proposals': len(proposals),
            'total_tcv': sum(p['tcv'] for p in proposals),
            'avg_acv': np.mean([p['acv'] for p in proposals if p['acv'] > 0]) if any(p['acv'] > 0 for p in proposals) else 0,
            'avg_probability': np.mean([p['probability'] for p in proposals if p['probability'] > 0]) if any(p['probability'] > 0 for p in proposals) else 0,
            'by_sales_type': self._count_by_field(proposals, 'sales_type'),
            'by_region': self._count_by_field(proposals, 'region'),
            'by_industry': self._count_by_field(proposals, 'industry'),
            'by_source': self._count_by_field(proposals, 'source'),
        }
    
    @staticmethod
    def _count_by_field(data: List[Dict], field: str) -> Dict[str, int]:
        """Count records by specific field"""
        counts = {}
        for record in data:
            value = record.get(field)
            if value:
                counts[value] = counts.get(value, 0) + 1
        return counts
    
    def generate_dashboard_json(self) -> Dict[str, Any]:
        """Generate complete dashboard JSON"""
        proposals = self.process_proposal_submitted()
        demos = self.process_demo()
        client_visits = self.process_client_direct_visit()
        dc_visits = self.process_dc_visit()
        
        dashboard = {
            'metadata': {
                'report_name': 'Sandesh Team Sales Funnel Dashboard',
                'generated_at': datetime.now().isoformat(),
                'total_sheets': 4,
            },
            'sheets': {
                'proposal_submitted': proposals,
                'demos': demos,
                'client_direct_visit': client_visits,
                'dc_visit': dc_visits,
            },
            'kpis': self._calculate_kpis(proposals, demos, client_visits, dc_visits),
        }
        
        return dashboard
    
    def _calculate_kpis(self, proposals, demos, visits, dc_visits) -> Dict[str, Any]:
        """Calculate key performance indicators"""
        return {
            'total_proposals': proposals['total_records'],
            'total_demos_conducted': demos['total_records'],
            'total_client_visits': visits['total_records'],
            'total_dc_visits': dc_visits['total_records'],
            'total_funnel_activities': (proposals['total_records'] + 
                                       demos['total_records'] + 
                                       visits['total_records'] + 
                                       dc_visits['total_records']),
            'revenue_metrics': {
                'total_tcv': proposals['summary']['total_tcv'],
                'avg_acv': round(proposals['summary']['avg_acv'], 2),
                'avg_deal_probability': round(proposals['summary']['avg_probability'], 2),
            }
        }


def main():
    """Main execution"""
    import os
    
    # Get the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    input_file = os.path.join(project_root, 'data', 'Sandesh_team_funnel_Report_.xlsx')
    output_file = os.path.join(project_root, 'output', 'sales_dashboard.json')
    
    processor = SalesDataProcessor(input_file)
    dashboard_data = processor.generate_dashboard_json()
    
    # Save to JSON file
    with open(output_file, 'w') as f:
        json.dump(dashboard_data, f, indent=2, default=str)
    
    print(f"✓ Dashboard JSON generated successfully!")
    print(f"✓ Output file: {output_file}")
    print(f"\nDashboard Summary:")
    print(json.dumps(dashboard_data['kpis'], indent=2))


if __name__ == '__main__':
    main()
