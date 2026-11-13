/**
 * Salsabilah POS - Smart Invoice & Deposit Routing Controller
 * Showroom: SR Electronics Park (Dealer Code: DEAL002905)
 * Location: Hatboalia Bazar, Alamdanga, Chuadanga
 */

const STORAGE_KEY = 'salsabilah_pos_invoices_2026';

// Baseline Reconciled Figures from Ground Truth Ledger
const BASE_METRICS = {
  totalSales: 24368727,
  collected: 18228005,
  outstandingDue: 2889985.93
};

class SmartInvoiceController {
  constructor() {
    this.invoices = this.loadInvoices();
    this.initEventListeners();
    this.renderDashboard();
  }

  loadInvoices() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Storage read error:', err);
      return [];
    }
  }

  saveInvoices() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.invoices));
  }

  generateInvoiceNo() {
    const baseNum = 829 + this.invoices.length;
    return String(baseNum).padStart(9, '0');
  }

  initEventListeners() {
    const billTotal = document.getElementById('billTotal');
    const billPaid = document.getElementById('billPaid');
    const posForm = document.getElementById('posForm');
    const brandLedger = document.getElementById('brandLedger');
    const depositAccount = document.getElementById('depositAccount');

    const calculateDue = () => {
      const total = parseFloat(billTotal.value) || 0;
      const paid = parseFloat(billPaid.value) || 0;
      const due = Math.max(0, total - paid);
      document.getElementById('netDueText').textContent = `৳ ${due.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (billTotal && billPaid) {
      billTotal.addEventListener('input', calculateDue);
      billPaid.addEventListener('input', calculateDue);
    }

    // Auto-suggest Deposit Account based on selected Brand
    if (brandLedger && depositAccount) {
      brandLedger.addEventListener('change', (e) => {
        const brand = e.target.value;
        if (brand === 'Butterfly Marketing Limited') {
          depositAccount.value = 'Butterfly Corporate Remittance Ledger';
        } else if (brand === 'MyOne Electronics') {
          depositAccount.value = 'DBBL - MyOne Account (1041100034560)';
        } else if (brand === 'Minister Hi-Tech Park') {
          depositAccount.value = 'Pubali Bank - Banani Corp (3311901022846)';
        } else {
          depositAccount.value = 'Showroom Cash Drawer (Hatboalia)';
        }
      });
    }

    if (posForm) {
      posForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createNewSale();
      });
    }
  }

  createNewSale() {
    const total = parseFloat(document.getElementById('billTotal').value) || 0;
    const paid = parseFloat(document.getElementById('billPaid').value) || 0;
    const due = Math.max(0, total - paid);

    const invoice = {
      invoiceNo: this.generateInvoiceNo(),
      date: new Date().toLocaleString('en-GB', { hour12: true }),
      customer: document.getElementById('custName').value.trim(),
      phone: document.getElementById('custPhone').value.trim() || 'N/A',
      brand: document.getElementById('brandLedger').value,
      group: document.getElementById('custGroup').value,
      product: document.getElementById('productDesc').value.trim(),
      total: Number(total.toFixed(2)),
      paid: Number(paid.toFixed(2)),
      due: Number(due.toFixed(2)),
      depositTo: document.getElementById('depositAccount').value,
      dealerCode: 'DEAL002905'
    };

    this.invoices.unshift(invoice);
    this.saveInvoices();

    document.getElementById('posForm').reset();
    document.getElementById('netDueText').textContent = '৳ 0.00';
    this.renderDashboard();
  }

  renderDashboard() {
    let addedSales = 0;
    let addedCollected = 0;
    let addedDue = 0;

    this.invoices.forEach(inv => {
      addedSales += inv.total;
      addedCollected += inv.paid;
      addedDue += inv.due;
    });

    const totalSales = BASE_METRICS.totalSales + addedSales;
    const totalCollected = BASE_METRICS.collected + addedCollected;
    const totalDue = BASE_METRICS.outstandingDue + addedDue;

    document.getElementById('kpiTotalSales').textContent = `৳ ${Math.round(totalSales).toLocaleString('en-IN')}`;
    document.getElementById('kpiCollected').textContent = `৳ ${Math.round(totalCollected).toLocaleString('en-IN')}`;
    document.getElementById('kpiDue').textContent = `৳ ${Math.round(totalDue).toLocaleString('en-IN')}`;
    document.getElementById('kpiTodayCount').textContent = `${this.invoices.length} টি ইনভয়েস`;

    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    if (this.invoices.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:18px;">এখনো কোনো নতুন ইনভয়েস এন্ট্রি করা হয়নি। বাম পাশের ফর্ম থেকে নতুন বিক্রয় যোগ করুন।</td></tr>`;
      return;
    }

    tbody.innerHTML = this.invoices.map((inv, idx) => {
      const badgeClass = inv.brand.includes('Butterfly') ? 'tag tag-butterfly' : 'tag tag-minister';
      return `
        <tr>
          <td>
            <strong>#${inv.invoiceNo}</strong> — ${inv.customer}<br>
            <small style="color:#64748b;">${inv.product} (${inv.date})</small>
          </td>
          <td><span class="${badgeClass}">${inv.brand}</span></td>
          <td>
            মোট: ৳${inv.total.toLocaleString('en-IN')}<br>
            <small style="color:#16a34a;">জমা: ৳${inv.paid.toLocaleString('en-IN')}</small> | 
            <small style="color:#dc2626;">বাকি: ৳${inv.due.toLocaleString('en-IN')}</small>
          </td>
          <td><small>${inv.depositTo}</small></td>
          <td><button type="button" class="btn btn-sm btn-outline" onclick="printInvoice(${idx})">🖨 প্রিন্ট</button></td>
        </tr>
      `;
    }).join('');
  }
}

// Global Print Function
window.printInvoice = function(index) {
  const controller = window.posController;
  const inv = controller.invoices[index];
  if (!inv) return;

  const printArea = document.getElementById('printArea');
  printArea.style.display = 'block';
  printArea.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 420px; margin: 0 auto; padding: 16px; border: 1px solid #000;">
      <h2 style="text-align:center; margin:0;">SR ELECTRONICS PARK</h2>
      <p style="text-align:center; margin:4px 0; font-size:12px;">Dealer Code: DEAL002905 | Hatboalia, Alamdanga, Chuadanga</p>
      <hr>
      <p style="font-size:13px;"><strong>Invoice No:</strong> #${inv.invoiceNo}<br>
      <strong>Date:</strong> ${inv.date}<br>
      <strong>Customer:</strong> ${inv.customer} (${inv.phone})<br>
      <strong>Brand Ledger:</strong> ${inv.brand}</p>
      <table style="width:100%; border-collapse:collapse; font-size:13px; margin:10px 0;">
        <tr style="border-bottom:1px solid #000;"><th style="text-align:left;">Product</th><th style="text-align:right;">Amount</th></tr>
        <tr><td style="padding:6px 0;">${inv.product}</td><td style="text-align:right;">৳ ${inv.total.toFixed(2)}</td></tr>
      </table>
      <hr>
      <p style="font-size:13px; text-align:right;">
        <strong>Total Bill:</strong> ৳ ${inv.total.toFixed(2)}<br>
        <strong>Paid Amount:</strong> ৳ ${inv.paid.toFixed(2)}<br>
        <strong>Due Amount:</strong> ৳ ${inv.due.toFixed(2)}
      </p>
      <p style="font-size:11px;"><strong>Deposit Account:</strong> ${inv.depositTo}</p>
      <p style="text-align:center; font-size:11px; margin-top:16px;">Powered by Salsabilah POS — Salsabilah Amin Limited</p>
    </div>
  `;
  window.print();
  printArea.style.display = 'none';
};

// Global CSV Export Function
window.exportToCSV = function() {
  const controller = window.posController;
  if (!controller.invoices.length) {
    alert('ডাউনলোড করার মতো কোনো নতুন ইনভয়েস এখনো নেই।');
    return;
  }

  const headers = ['Invoice No', 'Date', 'Customer', 'Phone', 'Brand Ledger', 'Customer Group', 'Product', 'Total Bill', 'Paid', 'Due', 'Deposit Account'];
  const rows = controller.invoices.map(i => [
    i.invoiceNo, `"${i.date}"`, `"${i.customer}"`, `"${i.phone}"`, `"${i.brand}"`, `"${i.group}"`, `"${i.product}"`, i.total, i.paid, i.due, `"${i.depositTo}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SR_Electronics_Park_Sales_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Initialize POS Controller on Load
window.addEventListener('DOMContentLoaded', () => {
  window.posController = new SmartInvoiceController();
});
