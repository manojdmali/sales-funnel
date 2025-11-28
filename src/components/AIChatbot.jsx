import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Maximize2, Minimize2, Sparkles } from 'lucide-react';

const AIChatbot = ({ dashboardData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your AI Sales Assistant 🚀\n\nI can help you analyze your sales data. Try asking:\n• "Show me revenue summary"\n• "How many proposals do we have?"\n• "Who are our top clients?"\n• "What\'s our pipeline status?"' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const predefinedQuestions = [
    '📊 Revenue summary',
    '📋 How many proposals?',
    '👥 Top clients',
    '🎯 Demo status',
    '📍 Regional performance',
    '🏢 Industry breakdown',
    '👨💼 Sales team performance',
    '📦 Product analysis',
    '💰 Payment status',
    '🔄 Pipeline overview'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeData = (question) => {
    const q = question.toLowerCase();
    const data = dashboardData?.sheets || dashboardData || {};

    if (!data || Object.keys(data).length === 0) {
      return 'No data available. Please upload an Excel file first.';
    }

    // Handle both nested sheets structure and flat structure
    const getSheetData = (sheetName) => {
      return data[sheetName]?.data || data[sheetName] || [];
    };

    const getFieldValue = (item, fields) => {
      for (const field of fields) {
        if (item[field]) return item[field];
      }
      return null;
    };

    // Revenue queries
    if (q.includes('revenue') || q.includes('tcv') || q.includes('total contract')) {
      const proposals = getSheetData('proposal_submitted');
      if (proposals.length === 0) return 'No proposal data available.';
      const total = proposals.reduce((sum, p) => sum + (parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0), 0);
      const details = proposals.map(p => `• ${getFieldValue(p, ['client_name', 'account_name', 'organisation_name']) || 'N/A'}: ₹${(parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0).toFixed(2)} Cr`).join('\n');
      return `📊 Total Contract Value (TCV): ₹${total.toFixed(2)} Cr\n\nBreakdown (${proposals.length} proposals):\n${details}`;
    }

    if (q.includes('payment') || q.includes('collection') || q.includes('received')) {
      const payments = getSheetData('payment_collection');
      if (payments.length === 0) return 'No payment data available.';
      const received = payments.reduce((sum, p) => sum + (parseFloat(p.received_amount) || 0), 0);
      const invoice = payments.reduce((sum, p) => sum + (parseFloat(p.invoice_amount) || 0), 0);
      const pending = invoice - received;
      return `💰 Payment Summary:\n\n• Total Invoiced: ₹${invoice.toFixed(2)} Lakh\n• Total Received: ₹${received.toFixed(2)} Lakh\n• Pending: ₹${pending.toFixed(2)} Lakh\n• Collection Rate: ${invoice > 0 ? ((received/invoice)*100).toFixed(1) : 0}%`;
    }

    // Count queries
    if (q.includes('how many proposal')) {
      const proposals = getSheetData('proposal_submitted');
      const count = proposals.length;
      const stages = proposals.reduce((acc, p) => {
        const stage = getFieldValue(p, ['sales_stage', 'sales_stages']) || 'Not Specified';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});
      const stageList = Object.entries(stages).map(([k, v]) => `• ${k}: ${v}`).join('\n');
      return `📋 Total Proposals: ${count}\n\nBy Stage:\n${stageList}`;
    }

    if (q.includes('how many demo') || q.includes('demo status')) {
      const demos = getSheetData('demos');
      const proposals = getSheetData('proposal_submitted');
      const count = demos.length;
      
      const demosByRegion = demos.reduce((acc, d) => {
        const reg = d.region || 'Not Specified';
        acc[reg] = (acc[reg] || 0) + 1;
        return acc;
      }, {});
      
      const demosByStage = demos.reduce((acc, d) => {
        const stage = getFieldValue(d, ['sales_stage', 'sales_stages']) || 'Not Specified';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});
      
      const regionList = Object.entries(demosByRegion)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
      
      const stageList = Object.entries(demosByStage)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
      
      const clients = demos.slice(0, 8).map(d => `• ${getFieldValue(d, ['client_name', 'account_name']) || 'N/A'}`).join('\n');
      const conversionRate = demos.length > 0 ? ((proposals.length / demos.length) * 100).toFixed(0) : 0;
      
      return `🎯 Demo Status Overview:\n\n📊 Total Demos: ${count}\n\n🌍 By Region:\n${regionList}\n\n📈 By Stage:\n${stageList}\n\n👥 Recent Clients${count > 8 ? ' (showing 8)' : ''}:\n${clients || 'No demos recorded'}\n\n✅ Demo → Proposal Rate: ${conversionRate}%`;
    }

    if (q.includes('how many visit')) {
      const visits = getSheetData('client_direct_visit').length;
      const dc = getSheetData('dc_visit').length;
      return `🚗 Visit Summary:\n\n• Client Visits: ${visits}\n• DC Visits: ${dc}\n• Total Visits: ${visits + dc}`;
    }

    if (q.includes('how many order')) {
      const orders = getSheetData('order_booked');
      const count = orders.length;
      const total = orders.reduce((sum, o) => sum + (parseFloat(o.tcv) || parseFloat(o.amount) || 0), 0);
      return `📦 Total Orders: ${count}\n• Total Amount: ₹${total.toFixed(2)} Cr`;
    }

    // Client queries
    if (q.includes('client') && (q.includes('list') || q.includes('who') || q.includes('name'))) {
      const proposals = getSheetData('proposal_submitted');
      const orders = getSheetData('order_booked');
      const demos = getSheetData('demos');
      const allClients = [...new Set([
        ...proposals.map(p => getFieldValue(p, ['client_name', 'account_name', 'organisation_name'])),
        ...orders.map(o => getFieldValue(o, ['client_name', 'company_name', 'account_name'])),
        ...demos.map(d => getFieldValue(d, ['client_name', 'account_name']))
      ].filter(Boolean))];
      return allClients.length > 0 ? `👥 Clients (${allClients.length}):\n\n${allClients.slice(0, 15).map(c => `• ${c}`).join('\n')}${allClients.length > 15 ? '\n...and more' : ''}` : 'No client data available.';
    }

    // Industry queries
    if (q.includes('industry') || q.includes('sector')) {
      const proposals = getSheetData('proposal_submitted');
      const orders = getSheetData('order_booked');
      const visits = getSheetData('client_direct_visit');
      const industries = [...proposals, ...orders, ...visits].reduce((acc, p) => {
        const ind = getFieldValue(p, ['industry', 'sector']) || 'Not Specified';
        acc[ind] = (acc[ind] || 0) + 1;
        return acc;
      }, {});
      const sorted = Object.entries(industries).sort((a, b) => b[1] - a[1]);
      return `🏢 Industries:\n\n${sorted.map(([k, v]) => `• ${k}: ${v} activities`).join('\n')}`;
    }

    // Region queries
    if (q.includes('region') || q.includes('location') || q.includes('where')) {
      const allData = Object.keys(data).flatMap(key => getSheetData(key));
      const regions = allData.reduce((acc, p) => {
        const reg = p.region || 'Not Specified';
        acc[reg] = (acc[reg] || 0) + 1;
        return acc;
      }, {});
      const sorted = Object.entries(regions).sort((a, b) => b[1] - a[1]);
      return `📍 Regions:\n\n${sorted.map(([k, v]) => `• ${k}: ${v} activities`).join('\n')}`;
    }

    // Sales person queries
    if (q.includes('sales person') || q.includes('salesperson') || q.includes('who is selling') || q.includes('sales team')) {
      const allData = Object.keys(data).flatMap(key => getSheetData(key));
      const performance = allData.reduce((acc, p) => {
        const name = getFieldValue(p, ['sales_person', 'sales_person_name', 'opportunity_owner_name', 'employee_name']) || 'Not Specified';
        if (!acc[name]) acc[name] = { count: 0, value: 0 };
        acc[name].count++;
        acc[name].value += parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0;
        return acc;
      }, {});
      const sorted = Object.entries(performance).sort((a, b) => b[1].count - a[1].count);
      return `👨💼 Sales Team Performance:\n\n${sorted.slice(0, 10).map(([name, d]) => `• ${name}: ${d.count} activities${d.value > 0 ? `, ₹${d.value.toFixed(2)} Cr` : ''}`).join('\n')}`;
    }

    // Stage queries
    if (q.includes('stage') || q.includes('pipeline')) {
      const proposals = getSheetData('proposal_submitted');
      const funnel = getSheetData('funnel');
      const demos = getSheetData('demos');
      const visits = getSheetData('client_direct_visit');
      const orders = getSheetData('order_booked');
      
      const stages = [...proposals, ...funnel].reduce((acc, p) => {
        const stage = getFieldValue(p, ['sales_stage', 'sales_stages']) || 'Not Specified';
        if (!acc[stage]) acc[stage] = { count: 0, value: 0 };
        acc[stage].count++;
        acc[stage].value += parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0;
        return acc;
      }, {});
      
      const totalValue = Object.values(stages).reduce((sum, s) => sum + s.value, 0);
      const stageList = Object.entries(stages)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([k, v]) => `• ${k}: ${v.count} deals${v.value > 0 ? ` (₹${v.value.toFixed(2)} Cr)` : ''}`)
        .join('\n');
      
      return `🔄 Sales Pipeline Overview:\n\n📊 Pipeline Stages:\n${stageList}\n\n📈 Activity Summary:\n• Total Proposals: ${proposals.length}\n• Demos Conducted: ${demos.length}\n• Client Visits: ${visits.length}\n• Orders Booked: ${orders.length}\n• Total Pipeline Value: ₹${totalValue.toFixed(2)} Cr\n\n🎯 Conversion:\n• Visit → Demo: ${visits.length > 0 ? ((demos.length/visits.length)*100).toFixed(0) : 0}%\n• Demo → Proposal: ${demos.length > 0 ? ((proposals.length/demos.length)*100).toFixed(0) : 0}%\n• Proposal → Order: ${proposals.length > 0 ? ((orders.length/proposals.length)*100).toFixed(0) : 0}%`;
    }

    // Product queries
    if (q.includes('product') || q.includes('what are we selling')) {
      const orders = getSheetData('order_booked');
      const proposals = getSheetData('proposal_submitted');
      const products = [...orders, ...proposals].reduce((acc, o) => {
        const prod = getFieldValue(o, ['products_services', 'product', 'products', 'what_selling']) || 'Not Specified';
        if (!acc[prod]) acc[prod] = { count: 0, value: 0 };
        acc[prod].count++;
        acc[prod].value += parseFloat(o.tcv) || parseFloat(o.amount) || 0;
        return acc;
      }, {});
      const sorted = Object.entries(products).sort((a, b) => b[1].count - a[1].count);
      return `📦 Products:\n\n${sorted.slice(0, 10).map(([k, v]) => `• ${k}: ${v.count} deals${v.value > 0 ? `, ₹${v.value.toFixed(2)} Cr` : ''}`).join('\n')}`;
    }

    // Summary queries
    if (q.includes('summary') || q.includes('overview') || q.includes('tell me about')) {
      const proposals = getSheetData('proposal_submitted').length;
      const demos = getSheetData('demos').length;
      const visits = getSheetData('client_direct_visit').length;
      const orders = getSheetData('order_booked').length;
      const events = getSheetData('events_attend').length;
      const partners = getSheetData('partner_on_board').length;
      const tcv = getSheetData('proposal_submitted').reduce((sum, p) => sum + (parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0), 0);
      return `📊 Sales Dashboard Summary:\n\n• Proposals: ${proposals}\n• Demos: ${demos}\n• Client Visits: ${visits}\n• Orders Booked: ${orders}\n• Events: ${events}\n• Partners: ${partners}\n• Total TCV: ₹${tcv.toFixed(2)} Cr`;
    }

    // Highest/Lowest queries
    if (q.includes('highest') || q.includes('largest') || q.includes('biggest') || q.includes('top')) {
      const proposals = getSheetData('proposal_submitted');
      if (proposals.length === 0) return 'No proposal data available.';
      const sorted = [...proposals].sort((a, b) => (parseFloat(b.tcv) || parseFloat(b.tcv_in_cr) || 0) - (parseFloat(a.tcv) || parseFloat(a.tcv_in_cr) || 0));
      const top3 = sorted.slice(0, 3);
      return `🏆 Top Deals:\n\n${top3.map((p, i) => `${i+1}. ${getFieldValue(p, ['client_name', 'account_name']) || 'N/A'}: ₹${(parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0).toFixed(2)} Cr`).join('\n')}`;
    }

    // Average queries
    if (q.includes('average') || q.includes('avg')) {
      const proposals = getSheetData('proposal_submitted');
      if (proposals.length === 0) return 'No proposal data available.';
      const avg = proposals.reduce((sum, p) => sum + (parseFloat(p.tcv) || parseFloat(p.tcv_in_cr) || 0), 0) / proposals.length;
      return `📈 Average deal size: ₹${avg.toFixed(2)} Cr (based on ${proposals.length} proposals)`;
    }

    // Event queries
    if (q.includes('event')) {
      const events = getSheetData('events_attend');
      const eventList = events.slice(0, 10).map(e => `• ${e.event_name || 'N/A'} - ${e.date || e.event_date || 'N/A'}`).join('\n');
      return `🎪 Events (${events.length}):\n\n${eventList || 'No events data.'}${events.length > 10 ? '\n...and more' : ''}`;
    }

    // Partner queries
    if (q.includes('partner')) {
      const partners = getSheetData('partner_on_board');
      const partnerList = partners.slice(0, 10).map(p => `• ${getFieldValue(p, ['client_name', 'partner_name']) || 'N/A'}`).join('\n');
      return `🤝 Partners (${partners.length}):\n\n${partnerList || 'No partner data.'}${partners.length > 10 ? '\n...and more' : ''}`;
    }

    return "❓ I couldn't find specific data for that question.\n\nTry asking:\n• Revenue/TCV\n• Proposals/Demos/Visits\n• Clients/Industries/Regions\n• Sales team performance\n• Products/Orders\n• Summary/Overview";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = { type: 'bot', text: analyzeData(input) };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full p-5 shadow-2xl z-50 transition-all duration-300 hover:scale-110 group"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl shadow-2xl flex flex-col border border-white/50 transition-all duration-300 ${
          isFullscreen 
            ? 'inset-4 rounded-2xl' 
            : 'bottom-6 right-6 w-[420px] h-[500px] rounded-2xl'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                <Bot className="w-7 h-7" />
                <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">AI Sales Assistant</span>
                <div className="text-xs text-white/90 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  Online • Ready to help
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hover:bg-white/20 rounded-xl p-2.5 transition-all hover:scale-110"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 rounded-xl p-2.5 transition-all hover:scale-110 hover:rotate-90"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent to-white/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 animate-fadeIn ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'bot' && (
                  <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-purple-200">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-br-sm' 
                    : 'bg-white/80 backdrop-blur-sm border border-purple-100 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
                {msg.type === 'user' && (
                  <div className="w-11 h-11 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-gray-300">
                    <User className="w-6 h-6 text-gray-700" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-fadeIn">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-purple-200">
                  <Bot className="w-6 h-6 text-purple-600 animate-pulse" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl rounded-bl-sm p-4 shadow-md">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-5 py-3 border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {predefinedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question.replace(/^[📊📋👥🎯📍🏢👨💼📦💰🔄]\s/, ''));
                    setTimeout(() => handleSend(), 100);
                  }}
                  disabled={isTyping}
                  className="px-3 py-1.5 text-xs font-medium bg-white/80 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border border-purple-200 rounded-full transition-all hover:border-purple-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-5 border-t border-purple-100 bg-white/80 backdrop-blur-sm rounded-b-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your sales data..."
                className="flex-1 px-5 py-3.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-sm transition-all shadow-sm bg-white/80 backdrop-blur-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl px-6 py-3.5 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
