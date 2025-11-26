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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeData = (question) => {
    const q = question.toLowerCase();
    const data = dashboardData;

    if (!data || Object.keys(data).length === 0) {
      return 'No data available. Please upload an Excel file first.';
    }

    // Revenue queries
    if (q.includes('revenue') || q.includes('tcv') || q.includes('total contract')) {
      const proposals = data.proposal_submitted || [];
      if (proposals.length === 0) return 'No proposal data available.';
      const total = proposals.reduce((sum, p) => sum + (parseFloat(p.tcv_in_cr) || 0), 0);
      const details = proposals.map(p => `• ${p.client_name || 'Unknown'}: ₹${(parseFloat(p.tcv_in_cr) || 0).toFixed(2)} Cr`).join('\n');
      return `📊 Total Contract Value (TCV): ₹${total.toFixed(2)} Cr\n\nBreakdown (${proposals.length} proposals):\n${details}`;
    }

    if (q.includes('payment') || q.includes('collection') || q.includes('received')) {
      const payments = data.payment_collection || [];
      if (payments.length === 0) return 'No payment data available.';
      const received = payments.reduce((sum, p) => sum + (parseFloat(p.received_amount) || 0), 0);
      const invoice = payments.reduce((sum, p) => sum + (parseFloat(p.invoice_amount) || 0), 0);
      const pending = invoice - received;
      return `💰 Payment Summary:\n\n• Total Invoiced: ₹${invoice.toFixed(2)} Lakh\n• Total Received: ₹${received.toFixed(2)} Lakh\n• Pending: ₹${pending.toFixed(2)} Lakh\n• Collection Rate: ${((received/invoice)*100).toFixed(1)}%`;
    }

    // Count queries
    if (q.includes('how many proposal')) {
      const count = (data.proposal_submitted || []).length;
      const stages = (data.proposal_submitted || []).reduce((acc, p) => {
        const stage = p.sales_stage || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});
      const stageList = Object.entries(stages).map(([k, v]) => `• ${k}: ${v}`).join('\n');
      return `📋 Total Proposals: ${count}\n\nBy Stage:\n${stageList}`;
    }

    if (q.includes('how many demo')) {
      const count = (data.demos || []).length;
      const demos = data.demos || [];
      const clients = demos.map(d => `• ${d.client_name || 'Unknown'}`).join('\n');
      return `🎯 Total Demos: ${count}\n\nClients:\n${clients}`;
    }

    if (q.includes('how many visit')) {
      const visits = (data.client_direct_visit || []).length;
      const dc = (data.dc_visit || []).length;
      return `🚗 Visit Summary:\n\n• Client Visits: ${visits}\n• DC Visits: ${dc}\n• Total Visits: ${visits + dc}`;
    }

    if (q.includes('how many order')) {
      const orders = data.order_booked || [];
      const count = orders.length;
      const total = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
      return `📦 Total Orders: ${count}\n• Total Amount: ₹${total.toFixed(2)} Lakh`;
    }

    // Client queries
    if (q.includes('client') && (q.includes('list') || q.includes('who') || q.includes('name'))) {
      const proposals = data.proposal_submitted || [];
      const orders = data.order_booked || [];
      const allClients = [...new Set([...proposals.map(p => p.client_name), ...orders.map(o => o.company_name)].filter(Boolean))];
      return allClients.length > 0 ? `👥 Clients (${allClients.length}):\n\n${allClients.map(c => `• ${c}`).join('\n')}` : 'No client data available.';
    }

    // Industry queries
    if (q.includes('industry') || q.includes('sector')) {
      const proposals = data.proposal_submitted || [];
      const orders = data.order_booked || [];
      const industries = [...proposals, ...orders].reduce((acc, p) => {
        const ind = p.industry || 'Unknown';
        acc[ind] = (acc[ind] || 0) + 1;
        return acc;
      }, {});
      const sorted = Object.entries(industries).sort((a, b) => b[1] - a[1]);
      return `🏢 Industries:\n\n${sorted.map(([k, v]) => `• ${k}: ${v} deals`).join('\n')}`;
    }

    // Region queries
    if (q.includes('region') || q.includes('location') || q.includes('where')) {
      const proposals = data.proposal_submitted || [];
      const orders = data.order_booked || [];
      const regions = [...proposals, ...orders].reduce((acc, p) => {
        const reg = p.region || 'Unknown';
        acc[reg] = (acc[reg] || 0) + 1;
        return acc;
      }, {});
      const sorted = Object.entries(regions).sort((a, b) => b[1] - a[1]);
      return `📍 Regions:\n\n${sorted.map(([k, v]) => `• ${k}: ${v} deals`).join('\n')}`;
    }

    // Sales person queries
    if (q.includes('sales person') || q.includes('salesperson') || q.includes('who is selling') || q.includes('sales team')) {
      const proposals = data.proposal_submitted || [];
      const performance = proposals.reduce((acc, p) => {
        const name = p.sales_person_name || 'Unknown';
        if (!acc[name]) acc[name] = { count: 0, value: 0 };
        acc[name].count++;
        acc[name].value += parseFloat(p.tcv_in_cr) || 0;
        return acc;
      }, {});
      const sorted = Object.entries(performance).sort((a, b) => b[1].value - a[1].value);
      return `👨‍💼 Sales Team Performance:\n\n${sorted.map(([name, data]) => `• ${name}: ${data.count} deals, ₹${data.value.toFixed(2)} Cr`).join('\n')}`;
    }

    // Stage queries
    if (q.includes('stage') || q.includes('pipeline')) {
      const proposals = data.proposal_submitted || [];
      const funnel = data.funnel || [];
      const stages = [...proposals, ...funnel].reduce((acc, p) => {
        const stage = p.sales_stage || p.sales_stages || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {});
      return `🔄 Pipeline Stages:\n\n${Object.entries(stages).map(([k, v]) => `• ${k}: ${v}`).join('\n')}`;
    }

    // Product queries
    if (q.includes('product') || q.includes('what are we selling')) {
      const orders = data.order_booked || [];
      const products = orders.reduce((acc, o) => {
        const prod = o.product || 'Unknown';
        if (!acc[prod]) acc[prod] = { count: 0, value: 0 };
        acc[prod].count++;
        acc[prod].value += parseFloat(o.amount) || 0;
        return acc;
      }, {});
      const sorted = Object.entries(products).sort((a, b) => b[1].value - a[1].value);
      return `📦 Products:\n\n${sorted.map(([k, v]) => `• ${k}: ${v.count} orders, ₹${v.value.toFixed(2)} Lakh`).join('\n')}`;
    }

    // Summary queries
    if (q.includes('summary') || q.includes('overview') || q.includes('tell me about')) {
      const proposals = (data.proposal_submitted || []).length;
      const demos = (data.demos || []).length;
      const visits = (data.client_direct_visit || []).length;
      const orders = (data.order_booked || []).length;
      const tcv = (data.proposal_submitted || []).reduce((sum, p) => sum + (parseFloat(p.tcv_in_cr) || 0), 0);
      return `📊 Sales Dashboard Summary:\n\n• Proposals: ${proposals}\n• Demos: ${demos}\n• Client Visits: ${visits}\n• Orders Booked: ${orders}\n• Total TCV: ₹${tcv.toFixed(2)} Cr`;
    }

    // Highest/Lowest queries
    if (q.includes('highest') || q.includes('largest') || q.includes('biggest') || q.includes('top')) {
      const proposals = data.proposal_submitted || [];
      if (proposals.length === 0) return 'No proposal data available.';
      const sorted = proposals.sort((a, b) => (parseFloat(b.tcv_in_cr) || 0) - (parseFloat(a.tcv_in_cr) || 0));
      const top3 = sorted.slice(0, 3);
      return `🏆 Top Deals:\n\n${top3.map((p, i) => `${i+1}. ${p.client_name}: ₹${(parseFloat(p.tcv_in_cr) || 0).toFixed(2)} Cr`).join('\n')}`;
    }

    // Average queries
    if (q.includes('average') || q.includes('avg')) {
      const proposals = data.proposal_submitted || [];
      if (proposals.length === 0) return 'No proposal data available.';
      const avg = proposals.reduce((sum, p) => sum + (parseFloat(p.tcv_in_cr) || 0), 0) / proposals.length;
      return `📈 Average deal size: ₹${avg.toFixed(2)} Cr`;
    }

    // Event queries
    if (q.includes('event')) {
      const events = data.events_attend || [];
      const eventList = events.map(e => `• ${e.event_name || 'Unknown'} - ${e.event_date || 'N/A'}`).join('\n');
      return `🎪 Events (${events.length}):\n\n${eventList || 'No events data.'}`;
    }

    // Partner queries
    if (q.includes('partner')) {
      const partners = data.partner_on_board || [];
      const partnerList = partners.map(p => `• ${p.partner_name || 'Unknown'}`).join('\n');
      return `🤝 Partners (${partners.length}):\n\n${partnerList || 'No partner data.'}`;
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl z-50 transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed z-50 bg-white shadow-2xl flex flex-col border border-gray-200 transition-all duration-300 ${
          isFullscreen 
            ? 'inset-4 rounded-xl' 
            : 'bottom-6 right-6 w-96 h-[600px] rounded-lg'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <div>
                <span className="font-semibold text-lg">AI Sales Assistant</span>
                <div className="text-xs text-blue-100">Powered by Advanced Analytics</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 animate-fadeIn ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'bot' && (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md' 
                    : 'bg-white border border-gray-100 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
                {msg.type === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-fadeIn">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md p-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your sales data..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl px-6 py-3 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              💡 Try: "revenue summary", "top clients", "pipeline status"
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
