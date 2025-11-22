import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, ChevronLeft, Calculator, Info, Wallet, PiggyBank, CheckCircle, RefreshCw, Heart, Home, Shield, Coins, FileText, Plane, Receipt, Printer, Copy, Check, Youtube } from 'lucide-react';

// --- COMPONENTS DEFINED OUTSIDE (ป้องกัน Input หลุดโฟกัสเวลาพิมพ์) ---

// 1. Money Input Component (จัดรูปแบบมีลูกน้ำเมื่อพิมพ์เสร็จ)
const MoneyInput = ({ name, value, onChange, placeholder, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  // คำนวณค่าที่จะแสดงผล
  const displayValue = useMemo(() => {
      // ถ้าค่าเป็น 0 หรือว่างเปล่า ให้แสดงว่างๆ เพื่อให้เห็น placeholder
      if (value === 0 || value === '0' || !value) return '';
      
      // ถ้ากำลังพิมพ์ (Focus) ให้แสดงตัวเลขเพียวๆ เพื่อให้แก้ไขง่าย
      if (isFocused) return value.toString();
      
      // ถ้าพิมพ์เสร็จแล้ว (Blur) ให้แสดงรูปแบบมีลูกน้ำ
      return Number(value).toLocaleString('en-US');
  }, [value, isFocused]);

  return (
    <input
      type="text"
      inputMode="decimal" // ให้มือถือแสดงแป้นตัวเลข
      name={name}
      value={displayValue}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className={`block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-lg ${className}`}
    />
  );
};

// 2. Logo Component (Workmate Grade A)
const ChannelLogo = ({ className }) => {
  const [error, setError] = useState(false);
  const logoUrl = "https://yt3.googleusercontent.com/Fsz_Rw1OlzsDnm7KRQoY-PhV2OVEwBUxtXf0w82CwnrFPQ8nT1mBuRarYq9NIIjQWpBXkHpx5UE=s160-c-k-c0x00ffffff-no-rj";
  
  if (error) return <Calculator className={`${className} text-blue-600`} />;
  return (
    <img 
      src={logoUrl}
      alt="Workmate Grade A Logo" 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

// 3. Banner Component (Workmate Grade A)
const ChannelBanner = () => {
  const [error, setError] = useState(false);
  const bannerUrl = "https://yt3.googleusercontent.com/HV7peW3jdhc9pjttHNk70gSP_vuDnnhfUsAAPT-qclLr2Cq7lGwWrkBedPi1kcwBMJOEstAxo0o=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj";

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl mb-6 text-white flex flex-col items-center justify-center shadow-lg">
         <div className="flex items-center space-x-2 mb-2">
           <Youtube className="w-8 h-8" />
           <span className="font-bold text-xl">Workmate Grade A</span>
         </div>
         <p className="text-blue-100 text-sm">เพื่อนคู่คิดชาวออฟฟิศเกรดเอ</p>
      </div>
    );
  }
  return (
    <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
      <img 
        src={bannerUrl}
        alt="Workmate Grade A Banner" 
        className="w-full h-auto object-cover"
        onError={() => setError(true)} 
      />
    </div>
  );
};

// 4. Youtube Link Component
const YoutubeLink = () => (
  <a 
    href="https://www.youtube.com/@workmategradea" 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center text-xs text-gray-500 hover:text-red-600 transition mt-4"
  >
    <Youtube className="h-4 w-4 mr-1" />
    สนับสนุนโดย Workmate Grade A
  </a>
);

// --- MAIN COMPONENT ---

const ThaiTaxHelper = () => {
  const [step, setStep] = useState(0);
  
  // State สำหรับข้อมูลทั้งหมด
  const [formData, setFormData] = useState({
    // รายได้
    salaryMonthly: 0,
    bonus: 0,
    otherIncome: 0,
    
    // ค่าใช้จ่าย
    expenseType: 'standard', // standard or actual
    actualExpense: 0,
    
    // กลุ่ม 1: ส่วนตัวและครอบครัว
    deductionPersonal: 60000, // คงที่
    deductionSpouse: 0, // 60,000 ถ้ามี
    childGeneral: 0, // จำนวนบุตรทั่วไป (30,000)
    child2018: 0, // จำนวนบุตรคนที่ 2 ขึ้นไป เกิดหลังปี 61 (60,000)
    parents: 0, // จำนวนพ่อแม่ที่ดูแล (30,000/คน)
    disabledCare: 0, // จำนวนผู้พิการที่ดูแล (60,000/คน)
    antenatalCare: 0, // ค่าฝากครรภ์ (max 60,000)

    // กลุ่ม 2: ประกันและการออม (เพดาน 100k แรก)
    socialSecurity: 0, // ประกันสังคม (max 9,000)
    lifeInsurance: 0, // ประกันชีวิตทั่วไป
    healthInsurance: 0, // ประกันสุขภาพตนเอง (max 25,000 แต่รวมชีวิตไม่เกิน 100,000)
    healthParents: 0, // ประกันสุขภาพพ่อแม่ (max 15,000)

    // กลุ่ม 3: กองทุนและการเกษียณ (เพดาน 500k)
    providentFund: 0, // สำรองเลี้ยงชีพ / กบข. / สงเคราะห์ครู (max 15% หรือ 30% แล้วแต่กองทุน)
    ssf: 0, // SSF (max 30% ไม่เกิน 200,000)
    rmf: 0, // RMF (max 30% ไม่เกิน 500,000)
    pensionInsurance: 0, // ประกันบำนาญ (max 15% ไม่เกิน 200,000)
    nsf: 0, // กอช. (max 30,000)
    
    // กลุ่ม 4: กระตุ้นเศรษฐกิจ (แยกวงเงิน)
    thaiEsg: 0, // Thai ESG (max 30% ไม่เกิน 300,000 **เกณฑ์ใหม่ 2568**)
    homeLoanInterest: 0, // ดอกเบี้ยบ้าน (max 100,000)
    homeConstruction: 0, // สร้างบ้านใหม่ (ล้านละ 10,000 max 100,000)
    
    // NEW: มาตรการพิเศษ 2568
    easyEReceipt: 0, // Easy E-Receipt (max 50,000)
    tourMain: 0, // เที่ยวเมืองหลัก (max 20,000)
    tourSec: 0, // เที่ยวเมืองรอง (คำนวณ 1.5 เท่า, รวมกันไม่เกิน 30,000)
    
    // กลุ่ม 5: บริจาค
    donationEducation: 0, // บริจาคการศึกษา/กีฬา/รพ. (ลดหย่อน 2 เท่า)
    donationGeneral: 0, // บริจาคทั่วไป (ลดหย่อน 1 เท่า)
    politicalParty: 0 // บริจาคพรรคการเมือง (max 10,000)
  });

  // Helper function to format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  // Helper: แปลงค่า input เป็น number เสมอ
  const val = (key) => Number(formData[key] || 0);

  // --- 1. คำนวณรายได้ ---
  const totalIncome = (val('salaryMonthly') * 12) + val('bonus') + val('otherIncome');

  // --- 2. คำนวณค่าใช้จ่าย ---
  const totalExpenses = useMemo(() => {
    if (formData.expenseType === 'standard') {
      return Math.min(totalIncome * 0.5, 100000);
    }
    return val('actualExpense');
  }, [totalIncome, formData.expenseType, formData.actualExpense]);

  const incomeAfterExpenses = Math.max(0, totalIncome - totalExpenses);

  // --- 3. คำนวณลดหย่อน (Logic ซับซ้อน) ---
  const deductionDetails = useMemo(() => {
    // A. กลุ่มครอบครัว
    const groupFamily = 
      60000 + // ส่วนตัว
      val('deductionSpouse') +
      (val('childGeneral') * 30000) +
      (val('child2018') * 60000) +
      (Math.min(val('parents'), 4) * 30000) + // พ่อแม่สูงสุด 4 คน (พ่อแม่เรา+พ่อแม่แฟน)
      (val('disabledCare') * 60000) +
      Math.min(val('antenatalCare'), 60000);

    // B. กลุ่มประกัน (Life & Health Limit 100,000)
    const healthSelf = Math.min(val('healthInsurance'), 25000);
    const lifeAndHealth = Math.min(val('lifeInsurance') + healthSelf, 100000);
    const healthPar = Math.min(val('healthParents'), 15000);
    const socialSec = Math.min(val('socialSecurity'), 9000); // สมมติ 750*12
    const groupInsurance = lifeAndHealth + healthPar + socialSec;

    // C. กลุ่มเกษียณ (Retirement Basket Limit 500,000)
    // แต่ละตัวมีเงื่อนไข % ของรายได้ด้วย
    const limitPVD = 500000; // จริงๆ PVD 15% ของค่าจ้าง, กบข 30%
    const limitSSF = Math.min(200000, totalIncome * 0.30);
    const limitRMF = Math.min(500000, totalIncome * 0.30);
    const limitPension = Math.min(200000, totalIncome * 0.15);
    const limitNSF = 30000;

    const actualPVD = val('providentFund'); // ให้ user กรอกยอดจริงมาเลย (เราสมมติเขาไม่เกิน % ค่าจ้าง)
    const actualSSF = Math.min(val('ssf'), limitSSF);
    const actualRMF = Math.min(val('rmf'), limitRMF);
    const actualPension = Math.min(val('pensionInsurance'), limitPension);
    const actualNSF = Math.min(val('nsf'), limitNSF);

    const retirementSum = actualPVD + actualSSF + actualRMF + actualPension + actualNSF; // + สงเคราะห์ครู
    const groupRetirement = Math.min(retirementSum, 500000);

    // D. กลุ่มกระตุ้นเศรษฐกิจ (แยกจาก 500k)
    // Thai ESG (New 2024-25 Rule: Max 300,000 & 30% Income)
    const limitThaiESG = Math.min(300000, totalIncome * 0.30);
    const actualThaiESG = Math.min(val('thaiEsg'), limitThaiESG);
    
    // Property
    const property = Math.min(val('homeLoanInterest') + Math.min(val('homeConstruction'), 100000), 100000);
    
    // Easy E-Receipt 2568 (Max 50,000)
    const easyReceipt = Math.min(val('easyEReceipt'), 50000);

    // เที่ยวเมืองรอง 2568 (Max 30,000 combined)
    const tourMainDeduct = Math.min(val('tourMain'), 20000); // เมืองหลักไม่เกิน 20,000
    const tourSecDeductCalc = val('tourSec') * 1.5; // เมืองรองคูณ 1.5
    const tourTotal = Math.min(tourMainDeduct + tourSecDeductCalc, 30000);

    const groupStimulus = actualThaiESG + property + easyReceipt + tourTotal;

    // รวมลดหย่อนเบื้องต้น (ก่อนบริจาค)
    const initialDeduction = groupFamily + groupInsurance + groupRetirement + groupStimulus;
    const incomeBeforeDonation = Math.max(0, incomeAfterExpenses - initialDeduction);

    // E. กลุ่มบริจาค
    const limitDonationDouble = incomeBeforeDonation * 0.10;
    const actualDonationDoubleBase = val('donationEducation');
    const actualDonationDoubleDeduct = Math.min(actualDonationDoubleBase * 2, limitDonationDouble);
    const incomeAfterDoubleDonation = Math.max(0, incomeBeforeDonation - actualDonationDoubleDeduct);

    const limitDonationGeneral = incomeAfterDoubleDonation * 0.10;
    const actualDonationGeneral = Math.min(val('donationGeneral'), limitDonationGeneral);
    const donationPolitical = Math.min(val('politicalParty'), 10000);

    const groupDonation = actualDonationDoubleDeduct + actualDonationGeneral + donationPolitical;

    return {
      total: initialDeduction + groupDonation,
      groupFamily,
      groupInsurance,
      groupRetirement,
      groupStimulus,
      groupDonation,
      easyReceipt,
      tourTotal
    };
  }, [formData, incomeAfterExpenses, totalIncome]);

  const netIncome = Math.max(0, incomeAfterExpenses - deductionDetails.total);

  // ฟังก์ชันคำนวณภาษีขั้นบันได
  const calculateTaxStep = (net) => {
    let remainingIncome = net;
    let totalTax = 0;
    const breakdown = [];

    const brackets = [
      { limit: 150000, rate: 0, label: '0 - 150,000' },
      { limit: 300000, rate: 0.05, label: '150,001 - 300,000' },
      { limit: 500000, rate: 0.10, label: '300,001 - 500,000' },
      { limit: 750000, rate: 0.15, label: '500,001 - 750,000' },
      { limit: 1000000, rate: 0.20, label: '750,001 - 1,000,000' },
      { limit: 2000000, rate: 0.25, label: '1,000,001 - 2,000,000' },
      { limit: 5000000, rate: 0.30, label: '2,000,001 - 5,000,000' },
      { limit: Infinity, rate: 0.35, label: '5,000,001 ขึ้นไป' }
    ];

    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      const rangeSize = bracket.limit - previousLimit;
      
      let incomeInThisBracket = 0;
      
      if (remainingIncome > 0) {
        if (remainingIncome >= rangeSize) {
          incomeInThisBracket = rangeSize;
          if (bracket.limit === Infinity) incomeInThisBracket = remainingIncome;
        } else {
          incomeInThisBracket = remainingIncome;
        }
      }

      const taxInThisBracket = incomeInThisBracket * bracket.rate;
      
      if (incomeInThisBracket > 0 || i === 0) { 
         breakdown.push({
          ...bracket,
          incomeInBucket: incomeInThisBracket,
          taxAmount: taxInThisBracket
        });
      }

      totalTax += taxInThisBracket;
      remainingIncome -= incomeInThisBracket;
      previousLimit = bracket.limit;
      
      if (remainingIncome <= 0 && i > 0) break;
    }

    return { totalTax, breakdown };
  };

  const taxResult = calculateTaxStep(netIncome);

  // Input Handler (Updated for commas)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Remove commas to get raw number string
    const rawValue = value.replace(/,/g, '');
    
    // Check if it's a valid number (digits only)
    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: rawValue
      }));
    }
  };

  const renderNextButton = ({ disabled }) => (
    <button
      onClick={() => setStep(step + 1)}
      disabled={disabled}
      className={`mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-150 ease-in-out shadow-md print:hidden`}
    >
      ถัดไป <ArrowRight className="ml-2 h-5 w-5" />
    </button>
  );

  const renderPrevButton = () => (
    <button
      onClick={() => setStep(step - 1)}
      className="mr-auto flex items-center text-gray-500 hover:text-gray-700 transition print:hidden"
    >
      <ChevronLeft className="h-5 w-5" /> ย้อนกลับ
    </button>
  );

  // --- SCREENS ---

  const renderWelcomeScreen = () => (
    <div className="text-center py-8 px-4 print:hidden">
      <ChannelBanner />
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Workmate Tax Planner 2025</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        วางแผนภาษีปี 2568 สำหรับยื่นต้นปี 2569 ง่ายๆ ใน 4 ขั้นตอน (รวม Easy E-Receipt & เที่ยวเมืองรอง)
      </p>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-start hover:shadow-md transition">
          <div className="bg-blue-50 p-3 rounded-lg mr-4">
             <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">1. กรอกรายได้</h3>
            <p className="text-sm text-gray-500">รวมเงินเดือน โบนัส และรายได้อื่นๆ ตลอดทั้งปี</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-start hover:shadow-md transition">
          <div className="bg-orange-50 p-3 rounded-lg mr-4">
             <Coins className="h-6 w-6 text-orange-600" />
          </div>
          <div>
             <h3 className="font-bold text-gray-900">2. หักค่าใช้จ่าย</h3>
             <p className="text-sm text-gray-500">ระบบคำนวณหักเหมาให้อัตโนมัติ (สูงสุด 1 แสนบาท)</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-start hover:shadow-md transition">
           <div className="bg-pink-50 p-3 rounded-lg mr-4">
             <PiggyBank className="h-6 w-6 text-pink-600" />
           </div>
           <div>
             <h3 className="font-bold text-gray-900">3. เลือกค่าลดหย่อน</h3>
             <p className="text-sm text-gray-500">ครอบครัว, กองทุน, Easy E-Receipt, เที่ยวเมืองรอง ฯลฯ</p>
           </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-start hover:shadow-md transition">
           <div className="bg-green-50 p-3 rounded-lg mr-4">
             <FileText className="h-6 w-6 text-green-600" />
           </div>
           <div>
             <h3 className="font-bold text-gray-900">4. สรุปภาษี</h3>
             <p className="text-sm text-gray-500">ดูยอดที่ต้องจ่ายจริง พร้อมตารางขั้นบันไดละเอียด</p>
           </div>
        </div>
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform transition hover:-translate-y-1"
      >
        เริ่มคำนวณเลย!
      </button>
      
      <div className="mt-6 flex justify-center">
        <YoutubeLink />
      </div>
    </div>
  );

  const renderStepHeader = (title, stepNum) => (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {renderPrevButton()}
        <span className="mx-4 h-6 w-px bg-gray-300 hidden sm:block"></span>
        <div className="flex items-center hidden sm:flex">
           <ChannelLogo className="w-8 h-8 mr-2 rounded-full border border-gray-200" />
           <span className="font-bold text-gray-700 text-sm">Workmate Grade A</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-blue-600">ขั้นตอน {stepNum}/4: {title}</span>
    </div>
  );

  const renderIncomeStep = () => (
    <div className="animate-fade-in">
      {renderStepHeader("รายได้", 1)}
      <h2 className="text-2xl font-bold mb-2 flex items-center"><Wallet className="mr-2 text-blue-500" /> รายได้ทั้งปี 2568</h2>
      <p className="text-gray-500 mb-6">รวมรายได้จากทุกช่องทางเพื่อตั้งต้นคำนวณ</p>

      <div className="space-y-4">
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">เงินเดือน (เฉลี่ยต่อเดือน)</label>
          <MoneyInput name="salaryMonthly" value={formData.salaryMonthly} onChange={handleChange} placeholder="เช่น 30,000" />
        </div>
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">โบนัส (รวมทั้งปี)</label>
          <MoneyInput name="bonus" value={formData.bonus} onChange={handleChange} placeholder="เช่น 50,000" />
        </div>
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">รายได้อื่นๆ (เช่น ฟรีแลนซ์, ค่าเช่า)</label>
          <MoneyInput name="otherIncome" value={formData.otherIncome} onChange={handleChange} placeholder="ถ้ามี" />
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
        <p className="text-sm text-gray-600">ประมาณการรายได้รวมทั้งปี</p>
        <p className="text-3xl font-bold text-blue-700">{formatMoney(totalIncome)}</p>
      </div>

      {renderNextButton({ disabled: totalIncome <= 0 })}
      <div className="mt-8 text-center"><YoutubeLink /></div>
    </div>
  );

  const renderExpenseStep = () => (
    <div className="animate-fade-in">
      {renderStepHeader("ค่าใช้จ่าย", 2)}
      <h2 className="text-2xl font-bold mb-2">หักค่าใช้จ่าย</h2>
      <p className="text-gray-500 mb-6">
        สำหรับมนุษย์เงินเดือนทั่วไป เลือก "หักเหมา" ระบบจะคำนวณให้ตามกฎหมาย (50% ไม่เกิน 100,000 บาท)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div 
          onClick={() => setFormData({...formData, expenseType: 'standard'})}
          className={`p-4 border-2 rounded-xl cursor-pointer transition relative overflow-hidden ${formData.expenseType === 'standard' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
        >
          <div className="flex items-center mb-2">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.expenseType === 'standard' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
              {formData.expenseType === 'standard' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="font-bold text-gray-900">หักเหมา (แนะนำ)</span>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            ระบบคำนวณอัตโนมัติสูงสุด 100,000 บาท
          </p>
        </div>

        <div 
          onClick={() => setFormData({...formData, expenseType: 'actual'})}
          className={`p-4 border-2 rounded-xl cursor-pointer transition relative ${formData.expenseType === 'actual' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
        >
          <div className="flex items-center mb-2">
             <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${formData.expenseType === 'actual' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
              {formData.expenseType === 'actual' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <span className="font-bold text-gray-900">ตามจริง</span>
          </div>
          <p className="text-sm text-gray-600 ml-8 mb-2">
            เฉพาะกรณีมีหลักฐานและกฎหมายรองรับ
          </p>
          {formData.expenseType === 'actual' && (
            <div onClick={(e) => e.stopPropagation()}>
              <MoneyInput name="actualExpense" value={formData.actualExpense} onChange={handleChange} placeholder="ระบุจำนวนเงิน" className="mt-2 text-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <div className="flex justify-between mb-2">
           <span className="text-gray-600">รายได้รวม</span>
           <span className="font-medium">{formatMoney(totalIncome)}</span>
        </div>
        <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
           <span className="text-gray-600">หักค่าใช้จ่าย</span>
           <span className="font-medium text-red-500">- {formatMoney(totalExpenses)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-800 font-bold">เงินได้หลังหักค่าใช้จ่าย</span>
          <span className="text-xl font-bold text-gray-900">{formatMoney(incomeAfterExpenses)}</span>
        </div>
      </div>

      {renderNextButton({ disabled: false })}
      <div className="mt-8 text-center"><YoutubeLink /></div>
    </div>
  );

  const renderDeductionStep = () => (
    <div className="animate-fade-in">
      {renderStepHeader("ลดหย่อน 2568", 3)}
      <h2 className="text-2xl font-bold mb-4 flex items-center"><PiggyBank className="mr-2 text-pink-500" /> รายการลดหย่อน</h2>
      
      <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-6 print:h-auto print:overflow-visible">
        
        {/* 1. ครอบครัว */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-4">
          <div className="bg-pink-50 px-4 py-3 border-b border-pink-100 flex items-center print:bg-gray-50 print:border-gray-200">
            <Heart className="w-5 h-5 text-pink-500 mr-2 print:text-gray-600" />
            <h3 className="font-bold text-gray-800">ครอบครัว</h3>
          </div>
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-600">ผู้มีเงินได้ (ส่วนตัว)</span>
                <span className="font-medium">60,000 บาท</span>
             </div>
             <div className="flex items-center justify-between">
               <label className="text-sm text-gray-700">คู่สมรส (ไม่มีเงินได้)</label>
               <input type="checkbox" checked={val('deductionSpouse') > 0} onChange={(e) => setFormData({...formData, deductionSpouse: e.target.checked ? 60000 : 0})} className="h-5 w-5 text-pink-500 rounded print:hidden" />
               <span className="hidden print:inline font-medium">{val('deductionSpouse') > 0 ? '60,000 บาท' : '-'}</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-gray-500 mb-1">บุตร (เกิดก่อน 2561 หรือคนแรก)</label>
                  <MoneyInput name="childGeneral" value={formData.childGeneral} onChange={handleChange} placeholder="จำนวนคน (30k)" className="text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">บุตรคนที่ 2+ (เกิด 2561 เป็นต้นไป)</label>
                  <MoneyInput name="child2018" value={formData.child2018} onChange={handleChange} placeholder="จำนวนคน (60k)" className="text-sm" />
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-gray-500 mb-1">อุปการะพ่อแม่ (อายุ 60+)</label>
                  <MoneyInput name="parents" value={formData.parents} onChange={handleChange} placeholder="จำนวนคน (30k)" className="text-sm" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">ดูแลผู้พิการ</label>
                  <MoneyInput name="disabledCare" value={formData.disabledCare} onChange={handleChange} placeholder="จำนวนคน (60k)" className="text-sm" />
               </div>
             </div>
             <div>
                <label className="block text-xs text-gray-500 mb-1">ค่าฝากครรภ์และคลอดบุตร (จ่ายจริง)</label>
                <MoneyInput name="antenatalCare" value={formData.antenatalCare} onChange={handleChange} placeholder="สูงสุด 60,000" className="text-sm" />
             </div>
          </div>
        </div>

        {/* 2. ประกัน & สุขภาพ */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-4">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center print:bg-gray-50 print:border-gray-200">
            <Shield className="w-5 h-5 text-blue-500 mr-2 print:text-gray-600" />
            <h3 className="font-bold text-gray-800">ประกัน & สุขภาพ</h3>
          </div>
          <div className="p-4 space-y-3">
             <div>
               <label className="block text-sm text-gray-700 mb-1">ประกันสังคม (จ่ายจริงทั้งปี)</label>
               <MoneyInput name="socialSecurity" value={formData.socialSecurity} onChange={handleChange} placeholder="สูงสุด 9,000" className="text-sm" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">ประกันชีวิตทั่วไป + สะสมทรัพย์</label>
                  <MoneyInput name="lifeInsurance" value={formData.lifeInsurance} onChange={handleChange} placeholder="ลดหย่อนภาษี" className="text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">ประกันสุขภาพตนเอง</label>
                  <MoneyInput name="healthInsurance" value={formData.healthInsurance} onChange={handleChange} placeholder="max 25k (รวมชีวิตไม่เกิน 100k)" className="text-sm" />
                </div>
             </div>
             <div>
               <label className="block text-sm text-gray-700 mb-1">ประกันสุขภาพพ่อแม่</label>
               <MoneyInput name="healthParents" value={formData.healthParents} onChange={handleChange} placeholder="สูงสุด 15,000" className="text-sm" />
             </div>
          </div>
        </div>

        {/* 3. เกษียณ & กองทุน */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-4">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-indigo-500 mr-2 print:text-gray-600" />
              <h3 className="font-bold text-gray-800">กองทุนลดหย่อน (เกษียณ)</h3>
            </div>
            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded print:bg-gray-200 print:text-gray-800">รวมไม่เกิน 500,000</span>
          </div>
          <div className="p-4 space-y-3">
             <div>
               <label className="block text-sm text-gray-700 mb-1">กองทุนสำรองเลี้ยงชีพ / กบข. / สงเคราะห์ครู</label>
               <MoneyInput name="providentFund" value={formData.providentFund} onChange={handleChange} placeholder="ส่วนที่สะสมเพิ่ม" className="text-sm" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs text-gray-500 mb-1">SSF (สูงสุด 30%)</label>
                   <MoneyInput name="ssf" value={formData.ssf} onChange={handleChange} placeholder="max 200k" className="text-sm" />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">RMF (สูงสุด 30%)</label>
                   <MoneyInput name="rmf" value={formData.rmf} onChange={handleChange} placeholder="max 500k" className="text-sm" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs text-gray-500 mb-1">ประกันบำนาญ</label>
                   <MoneyInput name="pensionInsurance" value={formData.pensionInsurance} onChange={handleChange} placeholder="max 200k" className="text-sm" />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">กอช.</label>
                   <MoneyInput name="nsf" value={formData.nsf} onChange={handleChange} placeholder="max 30k" className="text-sm" />
                </div>
             </div>
          </div>
        </div>

        {/* 4. กระตุ้นเศรษฐกิจ & อสังหา */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-4">
          <div className="bg-green-50 px-4 py-3 border-b border-green-100 flex items-center justify-between print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center">
              <Home className="w-5 h-5 text-green-600 mr-2 print:text-gray-600" />
              <h3 className="font-bold text-gray-800">กระตุ้นเศรษฐกิจ & อสังหา</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
             {/* Easy E-Receipt */}
             <div className="p-3 bg-green-50 rounded-lg border border-green-100 print:bg-transparent print:border-gray-200">
                <div className="flex items-center mb-2">
                   <Receipt className="h-4 w-4 text-green-600 mr-2 print:text-gray-600" />
                   <label className="text-sm font-bold text-green-800 print:text-gray-800">Easy E-Receipt 2568</label>
                </div>
                <MoneyInput name="easyEReceipt" value={formData.easyEReceipt} onChange={handleChange} placeholder="16 ม.ค. - 28 ก.พ. 68 (max 50k)" className="text-sm mb-1" />
                <p className="text-xs text-green-600 print:hidden">ต้องเป็นใบกำกับภาษีอิเล็กทรอนิกส์ (e-Tax) เท่านั้น</p>
             </div>

             {/* Tourism */}
             <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 print:bg-transparent print:border-gray-200">
                <div className="flex items-center mb-2">
                   <Plane className="h-4 w-4 text-orange-600 mr-2 print:text-gray-600" />
                   <label className="text-sm font-bold text-orange-800 print:text-gray-800">เที่ยวดีมีคืน 2568 (ต.ค.-ธ.ค.)</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-xs text-gray-600 mb-1">เที่ยวเมืองหลัก</label>
                      <MoneyInput name="tourMain" value={formData.tourMain} onChange={handleChange} placeholder="จ่ายจริง (max 20k)" className="text-sm" />
                   </div>
                   <div>
                      <label className="block text-xs text-gray-600 mb-1">เที่ยวเมืองรอง</label>
                      <MoneyInput name="tourSec" value={formData.tourSec} onChange={handleChange} placeholder="จ่ายจริง (ลด 1.5 เท่า)" className="text-sm" />
                   </div>
                </div>
                <p className="text-xs text-orange-600 mt-2 print:hidden">รวมกันลดหย่อนสูงสุดไม่เกิน 30,000 บาท</p>
             </div>

             <div className="bg-gray-50 p-3 rounded border border-gray-100 print:bg-transparent print:border-gray-200">
               <label className="block text-sm font-bold text-gray-800 mb-2">Thai ESG & บ้าน</label>
               <div className="space-y-2">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Thai ESG (เกณฑ์ใหม่)</label>
                    <MoneyInput name="thaiEsg" value={formData.thaiEsg} onChange={handleChange} placeholder="ลดหย่อนสูงสุด 300,000 บาท" className="text-sm" />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">ดอกเบี้ยบ้าน</label>
                     <MoneyInput name="homeLoanInterest" value={formData.homeLoanInterest} onChange={handleChange} placeholder="max 100k" className="text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">สร้างบ้านใหม่</label>
                     <MoneyInput name="homeConstruction" value={formData.homeConstruction} onChange={handleChange} placeholder="1 หมื่น/ล้าน" className="text-sm" />
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* 5. บริจาค */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm print:border-gray-300 print:shadow-none print:mb-4">
          <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100 flex items-center print:bg-gray-50 print:border-gray-200">
            <Heart className="w-5 h-5 text-yellow-600 mr-2 print:text-gray-600" />
            <h3 className="font-bold text-gray-800">เงินบริจาค</h3>
          </div>
          <div className="p-4 space-y-3">
             <div>
               <label className="block text-sm text-gray-700 mb-1">การศึกษา / กีฬา / รพ. (ลดหย่อน 2 เท่า)</label>
               <MoneyInput name="donationEducation" value={formData.donationEducation} onChange={handleChange} placeholder="ระบุยอดเงินบริจาคจริง" className="text-sm" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs text-gray-500 mb-1">บริจาคทั่วไป</label>
                   <MoneyInput name="donationGeneral" value={formData.donationGeneral} onChange={handleChange} placeholder="ระบุยอดจริง" className="text-sm" />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">พรรคการเมือง</label>
                   <MoneyInput name="politicalParty" value={formData.politicalParty} onChange={handleChange} placeholder="max 10k" className="text-sm" />
                </div>
             </div>
          </div>
        </div>

      </div>

      <div className="mt-4 flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-lg print:bg-white print:text-black print:border print:border-gray-300 print:shadow-none">
        <span className="text-sm">รวมลดหย่อนทั้งหมด (คำนวณตามเงื่อนไข)</span>
        <span className="text-xl font-bold text-green-400 print:text-black">{formatMoney(deductionDetails.total)}</span>
      </div>

      {renderNextButton({ disabled: false })}
      <div className="mt-8 text-center"><YoutubeLink /></div>
    </div>
  );

  const renderResultScreen = () => (
    <div className="animate-fade-in pb-10 print:pb-0">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 print:hidden space-y-4 md:space-y-0">
        <div className="flex items-center">
          {renderPrevButton()}
          <span className="mx-4 h-6 w-px bg-gray-300 hidden sm:block"></span>
          <div className="flex items-center hidden sm:flex">
             <ChannelLogo className="w-8 h-8 mr-2 rounded-full border border-gray-200" />
             <span className="font-bold text-gray-700 text-sm">Workmate Grade A</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => setStep(0)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-sm text-sm font-medium">
            <RefreshCw className="h-4 w-4 mr-2" /> เริ่มใหม่
          </button>
        </div>
      </div>

      {/* Header for Print Only */}
      <div className="hidden print:block text-center mb-6">
        <div className="flex items-center justify-center mb-2">
           <ChannelLogo className="w-12 h-12 rounded-full border border-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">สรุปการคำนวณภาษีเงินได้บุคคลธรรมดา ปี 2568</h1>
        <p className="text-gray-500 text-sm">สร้างโดย: ผู้ช่วยคำนวณภาษีสำหรับมือใหม่ (Workmate Grade A)</p>
        <p className="text-gray-400 text-xs mt-1">วันที่พิมพ์: {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 print:shadow-none print:border-gray-300">
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 p-8 text-white text-center relative overflow-hidden print:bg-white print:from-white print:to-white print:text-black print:p-4 print:border-b print:border-gray-300">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent print:hidden"></div>
          <p className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2 relative z-10 print:text-gray-600">ภาษีที่ต้องจ่ายปี 2568 (ประมาณการ)</p>
          <h1 className="text-6xl font-extrabold mb-2 relative z-10 tracking-tight print:text-4xl">{formatMoney(taxResult.totalTax)}</h1>
          <p className="text-blue-200 text-sm relative z-10 print:text-gray-500">คิดเป็น {((taxResult.totalTax / totalIncome) * 100 || 0).toFixed(2)}% ของรายได้รวม</p>
        </div>

        <div className="p-6 md:p-8 print:p-4">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8 print:grid-cols-3 print:gap-2">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-transparent print:border-gray-300">
                <p className="text-xs text-gray-500 uppercase font-bold">รายได้รวม</p>
                <p className="font-bold text-lg text-gray-800">{formatMoney(totalIncome)}</p>
             </div>
             <div className="bg-red-50 p-4 rounded-xl border border-red-100 print:bg-transparent print:border-gray-300">
                <p className="text-xs text-red-500 uppercase font-bold print:text-red-700">รวมหักค่าใช้จ่าย & ลดหย่อน</p>
                <p className="font-bold text-lg text-red-600 print:text-red-700">- {formatMoney(totalExpenses + deductionDetails.total)}</p>
             </div>
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm print:bg-transparent print:border-gray-300 print:shadow-none">
                <p className="text-xs text-blue-600 uppercase font-bold print:text-blue-800">เงินได้สุทธิ (ฐานภาษี)</p>
                <p className="font-bold text-lg text-blue-800">{formatMoney(netIncome)}</p>
             </div>
           </div>

           {/* Breakdown Table */}
           <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg print:text-base">
             <Calculator className="h-5 w-5 mr-2 text-blue-500 print:hidden" />
             รายละเอียดการคำนวณภาษี
           </h3>
           
           <div className="overflow-hidden rounded-lg border border-gray-200 mb-6 print:border-gray-300">
             <table className="min-w-full text-sm text-left">
               <thead className="bg-gray-100 text-gray-600 font-semibold print:bg-gray-50">
                 <tr>
                   <th className="px-4 py-3 print:py-2">ช่วงเงินได้สุทธิ</th>
                   <th className="px-4 py-3 text-center print:py-2">อัตรา</th>
                   <th className="px-4 py-3 text-right print:py-2">เงินในขั้นนี้</th>
                   <th className="px-4 py-3 text-right print:py-2">ภาษี</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 print:divide-gray-200">
                 {taxResult.breakdown.map((item, index) => (
                   <tr key={index} className={item.incomeInBucket > 0 ? "bg-blue-50/30 print:bg-transparent" : ""}>
                     <td className="px-4 py-3 text-gray-700 print:py-2">{item.label}</td>
                     <td className="px-4 py-3 text-center print:py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${item.rate === 0 ? 'bg-green-100 text-green-800 print:bg-transparent print:text-black print:border print:border-gray-300' : 'bg-gray-200 text-gray-600 print:bg-transparent print:text-black'}`}>
                          {item.rate * 100}%
                        </span>
                     </td>
                     <td className="px-4 py-3 text-right font-medium text-gray-600 print:py-2">
                        {item.incomeInBucket > 0 ? formatMoney(item.incomeInBucket) : '-'}
                     </td>
                     <td className="px-4 py-3 text-right font-bold text-gray-900 print:py-2">
                        {item.taxAmount > 0 ? formatMoney(item.taxAmount) : '-'}
                     </td>
                   </tr>
                 ))}
               </tbody>
               <tfoot className="bg-gray-50 font-bold border-t border-gray-200 print:bg-gray-100">
                 <tr>
                   <td colSpan={3} className="px-4 py-3 text-right text-gray-800 print:py-2">รวมภาษีทั้งหมด</td>
                   <td className="px-4 py-3 text-right text-blue-700 text-lg print:text-black print:py-2">{formatMoney(taxResult.totalTax)}</td>
                 </tr>
               </tfoot>
             </table>
           </div>
           
           <div className="flex items-start bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-100 print:border-gray-300 print:bg-transparent print:text-gray-600">
             <Info className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-600 print:hidden" />
             <span>
               <strong>หมายเหตุ:</strong> ผลลัพธ์นี้เป็นการประมาณการเบื้องต้นสำหรับปีภาษี 2568 (ยื่นต้นปี 2569) โปรดตรวจสอบกับกรมสรรพากรอีกครั้ง
             </span>
           </div>
        </div>
      </div>

      {/* Banner Link at the bottom */}
      <div className="print:hidden mt-8">
         <a href="https://www.youtube.com/@workmategradea" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
            <ChannelBanner />
         </a>
         <div className="text-center mt-2">
            <YoutubeLink />
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 font-sans text-slate-800 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden print:overflow-visible print:shadow-none print:max-w-none print:rounded-none">
        {/* Progress Bar */}
        {step > 0 && step < 5 && (
          <div className="bg-gray-100 h-2 w-full print:hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 transition-all duration-500 ease-out rounded-r-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="p-6 md:p-8 min-h-[600px] flex flex-col print:min-h-0 print:p-4 print:block">
           {step === 0 && renderWelcomeScreen()}
           {step === 1 && renderIncomeStep()}
           {step === 2 && renderExpenseStep()}
           {step === 3 && renderDeductionStep()}
           {step === 4 && renderResultScreen()}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <ThaiTaxHelper />;
}