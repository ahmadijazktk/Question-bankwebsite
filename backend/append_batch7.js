import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = `
Question:
A 19 year old patient with SLE tolerating HCQ and MMF says she is up to date on all vaccinations. She wants to know if she needs the shingles vaccine because her PCP told her she is too young to get it. Do you recommend it?
Ans:
Yes,
ACR Vaccination Guidelines 2022 say shingles vaccine is recommended for all RMD patients >18 years of age taking immunosuppressive medication. 

Question:
A patient with well controlled Rheumatoid arthritis on Methotrexate 15mg/week and daily folic ask you if he needs the influenza vaccine. What do you say?
Ans:
Yes,
and that MTX needs to be held for 2 weeks after influenza vaccination (if disease activity allows), per ACR Vaccination Guidelines 2022

Question:
What is the management of DMARDs in relation to non-live attenuated vaccines?
Ans:
Continue all immunosuppressive medication aside from RTX. 
-Time vaccination for when the next rituximab dose is due, and then hold rituximab for at least 2 weeks after vaccination

Question:
What is the management of RMD who are taking prednisone ≤ 10mg daily and administering non-live vaccine?
Ans:
Strongly Rec'd to administer vaccine

Question:
For patients with RMD who are taking prednisone ≥ 20mg daily, what is the management for vaccines?
Ans:
Deferring non-live vaccinations (other than influenza), until dose tapering dose down to < 20mg daily
-"Conditionally rec'd"

Question:
If a neonate/infant receives Rituximab (because the mother did) during the 2nd or 3rd trimester, what is the management for rotavirus vaccination?
Ans:
Delaying live attenuated rotavirus until >6 months of age
-"Conditionally rec'd"

Question:
What is the recommendation for pneumococcal vaccine in a 25 year old patient with Rheumatoid arthritis stable on Arava?
Ans:
For patients with RMD age <65 years who are taking immunosuppressive medication, pneumococcal vaccination is strongly recommended. 

Question:
What is the management of the HPV vaccine in a 35 year old patient with SLE who is stable on HCQ and imuran?
Ans:
For patients with RMD age >26 and <45 years who are taking immunosuppressive medication and are not previously vaccinated, vaccination against HPV is "Conditionally recommended." 

Question:
What warrants continuing Rituximab during conception and/or during pregnancy?
Ans:
If SEVERE LIFE or ORGAN threatening maternal disease
-"Condtionally rec'd"

Question:
What is recommended for contraception for patients with SLE with moderate or severe disease activity (including nephritis)?
Ans:
STRONGLY RECOMMEND progestin-only or IUD contraceptive
-over combined estrogen-progestin contraception
Question:
A patient has a IgM+ anti-cardiolipin antibody. She has never had a clot. What recommendation do you have for contraception?
Ans:
STRONGLY RECOMMENDED AGAINST combined estrogen-progestin contraceptives in women with any positive aPLs because of risk of thromboembolism.
-STRONGLY RECOMMEND IUDs (levonorgestrel or copper) or the progestin-only pill in women with positive aPLs. 

Question:
A 35 year old female with a past medical history of HTN, HBV, and lymphoma is newly diagnosed with Rheumatoid arthritis. She mentions that she had HBV infection many years ago that never caused any problems, but was never vaccinated or treated because she was told by her doctor that she is "immunized" from the infection. She is only taking NSAIDs for pain. What is the next best step in her management?
A) Start oral Methotrexate
B) Start Rituximab
C) Treat HBV
D) Start HCQ
E) Check HBV surface antigen

Ans:
Answer is C)
Why?
Because the medical history of lymphoma automatically means Rituximab is the recommended treatment for her RA, per ACR. 
But you are told she has history of HBV without vaccination or treatment. So what would her hepatitis panel show?
She will be HBV core antibody positive (the most important point.)
She will also be likely be HBV surface antigen negative, and HBV surface antibody positive. Therefore, prior to receiving the recommended Rituximab, she needs to be prophylatically treated for HBV. 

This is STRONG REC'D

"Prophylactic antiviral therapy is strongly recommended over frequent monitoring
alone for patients initiating rituximab who are hepatitis B core antibody positive
(regardless of hepatitis B surface antigen status)."


Question:
For patients with Systemic Autoimmune Rheumatic Diseases (SARDs) at risk for developoing ILD, how is it recommended to screen these patients?
Ans:
For people with SARDs at increased risk of developing ILD, we conditionally recommend screening with HRCT chest and PFTs over PFTs alone.

Question:
For people with Systemic Autoimmune Rheumatic Diseases (SARDs) at increased risk of developing ILD, it is recommended to screen using 6mw. True or False?
Ans:
False
"For people with SARDs at increased risk of developing ILD, we conditionally recommend against screening with 6MWD."

Question:
For people with Systemic Autoimmune Rheumatic Diseases (SARDs) at increased risk of developing ILD, it is recommended to screen using chest xrays. True or False?
Ans:
False

"For people with SARDs at increased risk of developing ILD, we conditionally recommend against screening with chest radiography."
Question:
For people with Systemic Autoimmune Rheumatic Diseases (SARDs) at increased risk of developing ILD, it is recommended to screen using ambulatory desaturation. True or False?
Ans:
False

"For people with SARDs at increased risk of developing ILD, we conditionally recommend against screening with ambulatory desaturation testing."

Question:
A patient has SSc-ILD. What is recommended for 1st line treatment?
Ans:
Tocilizumab OR nintedanib

"For people with SSc-ILD and MCTD-ILD, we conditionally recommend tocilizumab as a first-line ILD treatment option."

"For people with SSc-ILD, we conditionally recommend nintedanib as a first-line ILD treatment option."

Question:
A patient has SSc-ILD. Prior to any DMARD options, a patient should first be treated with corticosteroids. True of False
Ans:
False, this is STRONGLY REC'D AGAINST

"For people with SSc-ILD, we strongly recommend against glucocorticoids as a first-line ILD treatment."


Question:
Within the 2023 ACR ILD guidelines, which is/are the recommendations classified as "STRONGLY"?
Ans:
There is only 1 "STRONG" recommendation, and it is "Strongly recommend AGAINST."

"For people with SSc-ILD, we strongly recommend against glucocorticoids as a first-line ILD treatment."

Question:
According to the ACR 2023 ILD guidelines, which scenario are CNIs recommended?
Ans:
Conditionally recommended for:

-patients with IIM-ILD (idiopathic inflammatory myositis-ILD) as a 1st line treatment

-patients with SARD (Systemic Autoimmune Rheumatic Diseases) associated RP-ILD


Question:
According to the ACR 2023 ILD guidelines, which medications are recommended as a 1st option for SARD (Systemic autoimmune rheumatic disease) associated RP-ILD (rapidly progressive-ILD)?
Ans:
IV pulse methylprednisolone
Rituximab
Cyclophosphamide
IVIG
MMF
CNI
JAKi

"For people with SARD and RP-ILD, we conditionally recommend pulse intravenous methylprednisolone as a first-line RP-ILD treatment."

"For people with SARD and RP-ILD, we conditionally recommend rituximab, cyclophosphamide, IVIG, mycophenolate, CNI, and JAK inhibitors as first-line RP-ILD treatment options."

Think of MDA5-associated RP-ILD

Question:
If a patient with Behcet's continue to have mucocutaneous ulcers despite steroids, azathioprine, colchicine, and apremilast, what is the next best step?
Ans:
TNFi monoclonal antibodies (ie. infliximab, adalimumab)

Question:
What type of ocular disease is typically seen with Behcet's?
Ans:
Panuveitis

-all 3 chambers are affected (anterior, intermediate, and posterior)


Question:
True or False
A 34 year old female with recently diagnosed SLE (stable on HCQ monotherapy) should have proteinuria screening done at least every 3-4 months. 
Ans:
False

"In people with SLE without known kidney disease, we STRONGLY recommend screening for proteinuria at least every 6-12 months...OR when experiencing extra-renal flares.

Question:
True or False

A 34 year old female with recently diagnosed SLE (on HCQ monotherapy) has been stable for the past 2 years. Her last follow up with you was 4 weeks ago. She is currently experiencing what you suspect to be a lupus flare with manifestations of rashes and inflammatory arthritis. Her last proteinuria screen at last checkup was completely normal. You should not check for proteinuria again today because it was recently checked and normal. 
Ans:
False

"In people with SLE without known kidney disease, we STRONGLY recommend screening for proteinuria at least every 6-12 months...OR when experiencing extra-renal flares.

Question:
A 29 year old female with SLE taking HCQ weight based and MMF 500mg BID is doing well overall. You do routine proteinuria screening which results with 0.5g. Her creatinine and GFR have remained stable compared to previous lab draws. She has no symptoms (ie. no rashes, arthritis, etc.) or any complaints today. Should you order a renal biopsy?
Ans:
No. 
I made this tricky just for you to memorize. If proteinuria was >0.5g, then answer is Yes. This is just a "conditional rec'd". 

"In people with SLE who have proteinuria >0.5 g/g and/or impaired kidney function not otherwise explained, we CONDITIONALLY recommend performing a kidney biopsy.

Question:
A 29 year old female with SLE taking HCQ weight based and MMF 500mg BID is doing well overall. CBC, CMP, dsDNA levels, and complement levels are stable.
You do routine proteinuria screening which results with 0.6g. Her creatinine and GFR have remained stable compared to previous lab draws. She has no symptoms (ie. no rashes, arthritis, etc.) or any complaints today. Should you order a renal biopsy?
Ans:
Yes. 
This is another tricky question just to help you memorize. It is similar to another question with only some numbers changed. 
Essentially if routine screening shows >0.5g proteinuria, order renal biopsy (***according to ACR, "conditionally rec'd***). 

"In people with SLE who have proteinuria >0.5 g/g and/or impaired kidney function not otherwise explained, we CONDITIONALLY recommend performing a kidney biopsy.

Question:
A 35 year old female with PMH of SLE presented with photosensitive rashes in addition to 1g of proteinuria on routine screening. She was currently on weight based HCQ at that time. A renal biopsy shows new lupus nephritis class III with no class V present.
She undergoes induction steroid protocol with subsequent steroid tapering in addition to MMF + IV belimumab. Today on her first followup visit she says she says she is doing well with no rashes or concerning symptoms.
Most recent lab check shows improvement in kidney function with reduction of proteinuria to 0.3g. What is your next step in medication management?
Ans:
Add a RAAS-I (ie. ACEi, ARBs, or direct renin inhibitors). 

"In people with ACTIVE/NEW ONSET/FLARE of Class III/IV or V lupus nephritis...…With any elevation in level of proteinuria, including <0.5g/g, we CONDITIONALLY recommend the addition of RAAS-I."

Question:
In patients with ACTIVE/NEW ONSET/FLARE of Class III/IV or Class V lupus nephritis, what are the ACR recommendations regarding steroid induction/tapering? 
Ans:
"We CONDITIONALLY recommend pulse intravenous glucocorticoids 250-1000 mg methylprednisolone daily x 1- 3 days, followed by oral glucocorticoid ≤0.5 mg/kg/day (maximum dose 40 mg/day) with taper to a target dose of ≤5mg/day by 6 months."

Question:
A 40 year old male with PMH of SLE and lupus nephritis is currently on HCQ, MMF, lisinopril and belimumab. A previous renal biopsy showed Class IV lupus nephritis. He continues to have decreased kidney dysfunction and fluctuating levels of proteinuria. His last follow up was 6 months ago and would like to keep his follow up schedule the same. What is your next best step in managing his condition, per ACR?
Ans:
Increase follow ups to every 3 months, particularly for proteinuria checking....this is a ***STRONG REC'D***

"In people with LN who have not achieved complete renal response, we STRONGLY recommend quantifying proteinuria at least every 3 months."
-----------------

***in patients who have sustained complete renal response, it is STRONGLY rec'd to check proteinuria every 3-6 months for monitoring. 

Question:
In a patient with new onset Class IV (without concomittant Class V) lupus nephritis, with is/are the medication recommendation(s)?
Ans:
TRIPLE immunosuppressive therapy, which is pulse IV glucocorticoids 250-1000mg methylprednisolone daily x 1-3 days, followed by oral glucocorticoid ≤0.5 mg/kg/day (maximum dose 40 mg/day) with taper plus:

-MMF + belimumab...or
-MMF + CNI (calcineurin inhibitor)...or
-Low dose CYC (Euro-Lupus Nephritis Trial) + belimumab (MMF substituted for CYC after CYC course complete)

"Conditionally rec'd"
--------------------------------
It get's more specific than this actually, but you can break it down easily:

a) pick MMF + CNI if patient has proteinuria ≥3g/g (or if patient has Class 5 involvement) 

b) pick MMF + belimumab if patient has extra-renal symptoms

***ACR does not state any specific scenario to pick Low dose CYC. Only that if you pick CYC, you use the Euro-Lupus trial dosing (ie. Low dose CYC). 


Question:
In a patient with NEW ONSET/ACTIVE/ FLARE of ***pure*** Class 5 lupus nephritis with at least 1g of proteinuria, what are the ACR recommendations for treatment? 
Ans:
"CONDITIONALLY REC'D" TRIPLE immunosuppressive therapy 

"consisting of pulse intravenous glucocorticoids 250-1000 mg methylprednisolone daily x 1-3 days, followed by oral glucocorticoid ≤0.5 mg/kg/day (maximum dose 40 mg/day) with taper and MPAA (ie. MMF) plus CNI.

----------------------------
***if Class V with <1 g/g, we conditionally recommend treatment with glucocorticoids and/or immunosuppressant therapy (MPAA, AZA, or CNI).

Question:
A 33 year old female with PMH of SLE and lupus nephritis Class IV has been doing well on weight based HCQ, MMF, and belimumab. Her last renal biopsy was 2 years ago, afterwhich she underwent induction followed by tapering of steroids in addition to her current medications. Her proteinuria and kidney function improved and has remained stable since then. 
She has no complaints today. Routine screening shows normal CBC, CMP, dsDNA and complements levels. Routine proteinuria screening however shows a noticeable increase compared to previous levels. 

According to ACR, should you repeat a renal biopsy? 

Ans:
Yes (although in "real life" you may disagree, we are talking about what ACR says...and it is a "Conditional Rec'd")

"For people with treated LN in remission who present with suspected LN flare (increased proteinuria, hematuria, and/or worsening kidney function), OR... for people with ≥6 months of appropriate treatment and ongoing/worsening proteinuria, hematuria, and/or decreased kidney function, we CONDITIONALLY recommend repeat kidney biopsy."

Question:
A patient with newly diagnosed SLE has a renal biopsy which shows Class IV lupus nephritis. You decide to start triple immunosuppressive therapy including induction steroids followed by tapering. 
After induction steroids, to what dose and how quickly should the steroids be tapered?
Ans:
After induction, oral steroids should dosed at ≤0.5 mg/kg/day (maximum dose 40 mg/day) with taper to a target dose of ≤5mg/day by 6 months.

Question:
A patient with PMH of SLE and Class IV lupus nephritis (diagnosed 1 year ago) received induction steroids followed by tapering in addition to HCQ, MMF, and belimumab. She is currently on HCQ, MMF, and belimumab and has been doing well with no complaints or signs of flares. Labwork has been stable for the past 2 years. 
She asks you how long she needs to be on her current medications given how stable she has been. What do you tell her? 
Ans:
For at least 3-5 years..."Conditionally rec'd"

In people with ACTIVE/NEW ONSET/FLARE of Class III/IV or Class V lupus nephritis...who have achieved/sustained a complete renal response after treatment with any (triple or dual) immunosuppressive therapy, we CONDITIONALLY recommend a total duration of therapy of at least 3-5 years.

Question:
A patient with SLE develops Class IV lupus nephritis. You decide to use CYC. What does ACR suggest regarding CYC for LN?
Ans:
***STRONGLY*** recommends ELNT low-dose CYC over daily oral CYC

***CONDITIONALLY*** recommend ELNT low-dose CYC over high-dose monthly pulse IV regimen


Question:
A patient with SLE and new onset Class IV lupus nephritis is now in remission after receiving induction steroids followed by tapering, in addition to low dose CYC (and HCQ). She recently moved and is establishing care with you, her new rheumatologist. Her kidney function has improved and was told by her previous rheumatologist that she had an "excellent" response. She is currently still on low dose CYC, in addition to HCQ and is prednisone 5mg daily. 
Aside from possibly lowering prednisone dose, what other medication changes should you make? 
Ans:
Continue with MMF 

In people with ACTIVE/NEW ONSET/FLARE of Class III/IV (with OR without CLASS V):

...Who have undergone DUAL immunosuppressive therapy (glucocorticoids plus either CYC or MPAA) and achieved a complete renal response, we CONDITIONALLY recommend continuing therapy with MPAA (ie. MMF) (over AZA).

Question:
A patient with SLE and newly diagnosed Class IV lupus nephritis received induction steroids plus tapering, in addition to HCQ and MMF. She recently moved across the country and is now establishing care with you as her new rheumatologist. She was told by her previous rheumatologist regarding her lupus nephritis that "she is doing better, but still with some room for improvement." She is currently on HCQ, MMF, and prednisone 5mg daily. 
She asks you what else can be done. 
What should you do? 
Ans:
Escalate to TRIPLE immunosuppressive therapy (she is currently on DUAL). 

Choice of 3rd drug (ie. belimumab or CNI) based on extra-renal symtoms (choose belimumab) vs. proteinuria (choose CNI such as voclosporin).
*Could also consider switching MMF to low dose CYC (ELNT) plus belimumab

"In people with ACTIVE/NEW ONSET/FLARE of Class III/IV (with or without Class V) lupus nephritis who have undergone DUAL immunosuppressive therapy (glucocorticoids plus either CYC or MPAA) and achieved a partial renal response, we CONDITIONALLY recommend escalating therapy to a TRIPLE immunosuppressive regimen."

Question:
A patient with SLE and newly diagnosed Class IV lupus nephritis received induction steroids plus tapering, in addition to HCQ, MMF, and belimumab. She recently moved across the country and is now establishing care with you as her new rheumatologist. She was told by her previous rheumatologist regarding her lupus nephritis that "she is still needing a better treatment regimen because her kidneys have not really responded."
She is currently on HCQ, MMF, belimumab and prednisone 5mg daily. 
She asks you what else can be done. 
What should you do? 
Ans:
Change to an alternative TRIPLE therapy choice 

or

Add anti-CD20 agent (ie. RTX)

"In people with any LN class with an inadequate renal response (i.e., have not achieved at least a partial renal response by 6-12 months) we CONDITIONALLY recommend escalation of treatment:
• For initial DUAL therapy, escalate to TRIPLE therapy.
• For initial TRIPLE therapy, change to an alternative TRIPLE therapy or consider addition of an antiCD20 agent as a second immunosuppressive."

Question:
A patient has newly diagnosed SLE with concomittant Class IV lupus nephritis. She was started on weight based HCQ, but following a renal biopsy showing LN she was started on induction (then tapering) steroids, followed by MMF in combination with belimumab. 
She continued to have worsening renal disease, therefore her regimen was switched to MMF in combination with voclosporin.
She is continuing to have moderate proteinuria and hematuria however on her routine labs. 
What are your next options for treatment, according to ACR? 
Ans:
You have 3 choices, according to ACR:
1) do combination MMF, belimumab, and CNI (ie. voclosporin). 
2) add anti-CD20 (ie. RTX) to current regimen
3) referral for investigational therapy

"In people with any LN class with refractory disease (i.e., failed two standard therapy courses), we CONDITIONALLY recommend treatment escalation to a more intensive regimen, including addition of anti-CD20 agents, OR.....combination therapy with three non-glucocorticoid immunosuppressives (i.e., MPAA, belimumab and CNI)....OR.... referral for investigational therapy."

Question:
In regards to lupus nephritis with development of end-stage kidney disease, what are the recommendations for the timing of dialysis? 
Ans:
STRONGLY recommend kidney transplantation over dialysis

"In people with LN and ESKD, we STRONGLY recommend kidney transplantation over dialysis."

"In people with LN who have progressive loss of kidney function and are nearing ESKD (eGFR of 15 ml/min/1.73m2 ), we CONDITIONALLY recommend preemptive kidney transplant over dialysis or non-preemptive transplant."

Question:
A patient with SLE and Class IV lupus nephritis establishes in your clinic. She has undergone multiple treatment regimens with HCQ, MMF, belimumab, CNIs, RTX, and induction/tapering steroids. She continues to have significant proteinuria and reduced kidney function. 
What is next best step in management?  
Ans:
"Consider adherence and/or other diagnoses (ie. aPL nephropathy)....OR advanced chronicity."


Question:
A patient has SLE and past Class IV and Class V lupus nephritis. He has already had a kidney transplantation and follows with his nephrologist. 
He is currently on HCQ. In terms of extra-renal symptoms, he has been "doing just fine" with no complaints. 
He asks if he still needs to follow up with you because he has been stable just on HCQ and his nephrologist is "managing his kidneys."
What do you tell him?
Ans:
Recommend regular follow up with rheumatologist...STRONG rec'd

"In people with LN on current dialysis or after kidney transplantation, we STRONGLY recommend regular follow up with rheumatology."

Question:
A 27 year old female with known SLE (+anti-Smith ab and +ANA) is being managed by her PCP. She was finally referred to a rheumatologist (you). Her main symptoms prior to being diagnosed were joint pain and rashes. Up until this point, she has been taking Tylenol for her joint pain, however her pain had not been adequately controlled so her PCP put her on oral prednisone 10mg daily which provided significant relief. You review her lab work and her CBC, CMP, UA, and inflammation markers have been normal since being on prednisone. Today she has no complaints and is happy with how she is doing currently still taking prednisone 10mg daily. You recheck her labwork and everything looks OK besides mild lymphopenia. What do you recommend to her? 

A) can stay on prednisone 10mg daily since she is doing so well
B) increase prednisone to 15mg daily to address the lymphopenia
C) add hydroxychloroquine while staying on prednisone 10mg daily
D) add hydroxychloroquine and taper prednisone to 5mg daily
E) do not add hydroxychloroquine because she is sexually active, but taper prednisone to 5mg daily
Ans:
D) add hydroxychloroquine and taper prednisone to 5mg daily

"In people with SLE with stable controlled SLE on prednisone >5 mg/day: ...We strongly recommend tapering the prednisone to a dose of ≤5 mg daily (and ideally to zero) within 6 months.".....STRONG REC'D

"In people with SLE: …We strongly recommend routine treatment with HCQ unless contraindicated.".....STRONG REC'D

These are from the 2025 ACR Guideline for the Treatment of Systemic Lupus Erythematosus (SLE)

Question:
A 25 year old female with known SLE has been doing well on HCQ 200mg daily which is appropriate for her weight. She has a follow up with you today and as always says she is doing well with no complaints. She previously had joint pain and rashes that were uncontrolled however since taking HCQ you tell her she has been in remission. She has been taking HCQ for 5 years and wants to know if she should continue taking it. Her routine lab work today is normal. What do you tell her? 
Ans:
Continue taking HCQ. 

According to ACR
In people with SLE:
…We conditionally recommend continuing HCQ therapy indefinitely, even in the setting of sustained remission.

CONDITIONAL REC'D

Question:
A 30 year old female with SLE (+anti-Smith, +ANA) has been in remission on HCQ weight based, and 5mg daily prednisone. Her symptoms are well controlled and she no longer has inflammatory joint pain or rashes. She wants to stay on her current regimen. What is your next best step? 
Ans:
Recommend a slow taper toward zero while staying on HCQ. 

According to ACR:
"In people with SLE with sustained remission on prednisone ≤5 mg/day, we conditionally recommend a slow taper toward zero."

Question:
A 30 year old female with SLE (+anti-Smith, +ANA) has been in remission on HCQ weight based, and 5mg daily prednisone. Her symptoms are welll controlled and she no longer has inflammatory joint pain or rashes. You advised to taper off prednisone however her inflammatory joint pain will flare when she tries to reduce prednisone below 5mg daily. What is your next step? 
Ans:
According to ACR:

"In people with SLE who are unable to taper prednisone to  ≤5 mg/day, we conditionally recommend intiating or escalating immunosuppressive therapy."

Under Musculoskeletal Arthritis in the 2025 ACR SLE Treatment Guideline:
"For persistent or recurrent active SLE arthritis on HCQ, regardless of prior/current NSAIDs or short-term glucocorticoid therapy: …We conditionally recommend initial therapy with MTX, MPAA, or AZA, with a low threshold to add or substitute with belimumab or anifrolumab for inadequate response over initial biologic therapy."

Question:
A 28 year old female with SLE has been stable on HCQ weight based for many years. She has been off of prednisone for many years. Her most recent blood work at the previous 3 visits showed neutropenia, but the remainder of her blood work has remained normal, including kidney function with urinalysis. She denies any symptoms and says she is feeling fine. What is your next best step?

A) restart her prednisone but no more than 5mg daily 
B) start MMF
C) start belimumab 
D) start anifrolumab
E) observation
Ans:
E) observation

According to ACR:
"Leukopenia: For asymptomatic neutropenia and/or lymphopenia (absolute counts <1000/mcL for either) attributed to SLE …We conditionally recommend against initiating immunosuppressive treatment (glucocorticoids, conventional or biologic immunosuppressants) in the absence of other lupus disease activity.

Question:
A 28 year old female with SLE has been stable on HCQ weight based for many years. She has been off of prednisone for many years. Her most recent blood work at the previous 3 visits showed PLT count of 25,000/mcL, but the remainder of her blood work has remained normal, including kidney function with urinalysis. She denies any symptoms and says she is feeling fine. What is your next best step?

A) restart her prednisone but no more than 5mg daily 
B) start methotrexate
C) start belimumab 
D) start azathioprine in combination with prednisone
E) observation
Ans:
D) start azathioprine in combination with prednisone

According to ACR:
Thrombocytopenia: For chronic asymptomatic thrombocytopenia (<30,000/mcL) attributed to SLE …We conditionally recommend initiation of glucocorticoid with an additional therapy (MPAA, AZA, CNI, anti-CD 20 agents, belimumab, and/or IVIG) over observation or glucocorticoid monotherapy.

Essentially, steroids plus any of the listed steroid sparing agents above.
***MTX is not listed among them***

Question:
A 28 year old female with SLE has been stable on HCQ weight based for many years. She has been off of prednisone for many years. She has been complaining or frequent epistaxis that is new to her. Her most recent blood work at the previous visit showed PLT count of 25,000/mcL, but the remainder of her blood work has remained normal, including kidney function with urinalysis. She denies any other symptoms and says she is feeling fine. What is your next best step?

A) restart her prednisone but no more than 5mg daily 
B) start methotrexate
C) start prednisone in combination with IVIG and/or rituximab 
D) start azathioprine in combination with prednisone
E) start prednisone in combination with belimumab
Ans:
C) start prednisone in combination with IVIG and/or rituximab 

According to ACR:
"Thrombocytopenia: For symptomatic thrombocytopenia (i.e., active significant bleeding) attributed to SLE: …We conditionally recommend initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."

Question:
A 28 year old female with SLE has been stable on HCQ weight based for many years. She has been off of prednisone for many years. She has been complaining of chest pain with exertion that is new to her. Her most recent blood work at the previous visit showed Hgb count of 8, but the remainder of her blood work has remained normal, including kidney function with urinalysis. A direct coombs test is positive. She denies any other symptoms and says she is feeling fine. What is your next best step?

A) restart her prednisone but no more than 5mg daily 
B) start methotrexate
C) start prednisone in combination with IVIG and/or rituximab 
D) start azathioprine in combination with prednisone
E) start prednisone in combination with belimumab
Ans:
C) start prednisone in combination with IVIG and/or rituximab 

According to ACR
"Hemolytic Anemia: For symptomatic autoimmune hemolytic anemia (i.e., ischemic manifestations and/or hemodynamic instability) attributed to SLE: …We conditionally recommend initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."

***this is the same answer and treatment for symptomatic thrombocytopenia attributed to SLE***

Question:
What is the treatment choice for a patient with SLE and active lupus optic neuritis OR lupus acute confusional state OR acute lupus mononeuritis multiplex?
Ans:
Pulse/high-dose steroids plus IV CYC, MPAA (ie. MMF), or RTX

According to ACR
"Severe neuropsychiatric syndromes: For Active lupus optic neuritis -OR- Lupus acute confusional state -OR- Active lupus mononeuritis multiplex: …We conditionally recommend initial therapy with pulse/high-dose glucocorticoid taper plus immunosuppressive therapy with IV CYC, MPAA, or anti-CD20 therapy over pulse/high-dose glucocorticoid monotherapy alone."

Question:
A 34 year old female patient is referred to you for suspicion of SLE. You do autoimmune testing which results with +ANA, +dsDNA moderate titer, and a +aCL IgM high titer. Her main symptoms are fatigue, joint pain, and rashes. You start her on weight based HCQ and low dose prednisone and her symptoms improve. She mentioned having some "urinary problems" but just writes it off as weakened pelvic floor muscle from delivering her baby 1 year ago. A urinalysis is normal. 
On her next follow up she says she is feeling fine however her "urinary leakage" has progressed and she is more concerned. Her PCP was concerned so he ordered a MRI of her spine which showed increased T2 signal intensity longitudinally across T6-T9 with associated cord swelling. Her PCP sent her to a neurosurgeon based on the MRI results but she is still waiting to be seen in that clinic. You repeat blood work today and will follow up with those results with her as soon as they return. 
What are your next steps with this patient today?
A) continue current therapy of HCQ and prednisone 
B) continue current HCQ and start weaning prednisone to ≤5 mg daily because her SLE is in remission
C) pulse IV steroids plus RTX
D) add belimumab
E) pulse IV steroids plus IV CYC
Ans:
E) pulse IV steroids plus IV CYC
Why? This is SLE associated transverse myelitis.

According to ACR
"For active lupus myelitis: …We conditionally recommend initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."

***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is CONDITIONALLY REC'D by ACR 2025 guidelines.***

Question:
A 33 year old female with SLE has the following autoantibody panel:
+ANA
+Smith
+dsDNA
+Ribosomal P protein
+SSA

She is currently taking weight based HCQ and tolerating it well. She previously had inflammatory arthritis but that has been well controlled with HCQ. Her sister came with her to clinic today and is concerned because the patient had to be taken to the ER last week due to sudden behavioral changes, irritability, and auditory hallucinations. She was yelling in the ER waiting room that her family was plotting against her. 
Her exam today shows a malar rash. Lab studies show low complement levels compared to previous and elevated dsDNA levels. 
What is your next step?
A) referral to psychiatry
B) start risperidone
C) risperidone plus IV RTX
D) IV steroids
E) risperidone plus anifrolumab
Ans:
C) risperidone plus IV RTX

According to ACR
"For active lupus psychosis: …We conditionally recommend anti-psychotic therapy plus glucocorticoid, IV CYC, MPAA, or anti-CD20 therapy over anti-psychotic therapy alone."

Question:
A patient with SLE has new onset seizures. She is on HCQ alone. How do you optimize her SLE treatment? 
Ans:
According to ACR
"Seizure: For seizures attributed to active SLE: …We conditionally recommend anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone."

Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX. 

Question:
A 31 year old male with 4 year history of SLE presents with a 1 week history of new, non-blanching, palpable purpura on his lower extremities. He reports mild arthralgias but denies hematuria, fever, or abdominal pain. 
Exam shows multiple 2mm-5mm purpuric papules on both shins and ankles. Most up to date labs show low C3 C4, mild anemia, and elevated dsDNA. UA is unremarkable. Skin biopsy shows neutrophilic infiltration of small dermal vessels with fibrinoid necrosis. He has given a topical steroid cream to apply to the rash although it has not helped. 
What is next best step?
A) oral prednisone
B) dapsone
C) MTX
D) MMF
E) belimumab
Ans:
B) dapsone
This is leukocytoclastic vasculitis...

According to ACR
"Leukocytoclastic vasculitis: For ongoing mild cutaneous vasculitis despite topical and antimalarial therapies: …We conditionally recommend addition of dapsone or colchicine over immunosuppressive therapies including oral glucocorticoid."

Question:
A 28 year old woman with a 3 year history of SLE on HCQ presents with 4 days of sharp, pleuritic chest pain. It worsens when lying flat. She also reports mild shortness of breath and a dry cough. 
On exam her vitals are normal. Decreased breath sounds are noted at the right lung base and a pericardial fruction rub is heard at left sternal border. 
What is the most appropriate initial treatment? 
A) belimumab
B) IV CYC
C) oral colchicine plus NSAID
D) pericardiocentesis
E) oral colchicine plus oral steroids
Ans:
C) oral colchicine plus NSAID

"For lupus pleuropericarditis: …We conditionally recommend initial treatment with NSAID, colchicine, or their combination, with a low threshold for escalation to glucocorticoid therapy over initiating glucocorticoid therapy alone. For ongoing/recurrent episodes of lupus pleuropericarditis despite treatment with HCQ, NSAIDs, colchicine, and/or glucocorticoids necessitating escalation of therapy: …We conditionally recommend conventional (MPAA, AZA) or biologic immunosuppressive therapies."

Question:
A 35 year old woman with 5 year history of SLE (on HCQ) presents with 2 weeks of new, non-blanching, palpable purpura and painful ulcers on her lower extremities. Also has had arthralgias. 
Exam shows multiple purpuric papules and several shallow ulcers with violaceous borders on the shins. Labs show elevated ESR, low C3/C4, elevated dsDNA and positive SSA. UA is unremarkable. 
What do you do? 
Ans:
Pulse/high-dose steroid taper + conventional or biologic immunosuppressive therapy (preferred IV CYC or RTX over other options)

According to ACR
For vasculitis attributed to active SLE: …We conditionally recommend initial therapy with pulse/high-dose glucocorticoid taper and conventional (IV CYC, MPAA, AZA) or biologic (anti-CD 20 therapy, belimumab, anifrolumab) immunosuppressive therapy over glucocorticoid monotherapy alone;

…We conditionally recommend IV CYC or anti-CD20 therapy as initial therapy over other immunosuppressive therapies.

Question:
A 40 year old female with a known history of SLE comes to you for follow up. She has been stable on weight based HCQ. She previously had rashes and arthralgia as her main symptoms, however she has been without those symptoms for the past few years. 
She has no other known medical problems. Lately however she has been complaining of some SOB and worsening fatigue. She also said her legs have felt a little swollen. Her PCP prescribed furosemide 40mg to take as needed which has helped her swelling. 
What do you do?

A) Add MTX and course of oral prednisone
B) Add a course of oral prednisone alone
C) Add MMF
D) Add IV CYC
E) Add course of oral prednisone with IV CYC
F) Observation
Ans:
E) Add course of oral prednisone with IV CYC

According to ACR...
Myocarditis: For lupus myocarditis that is acute and/or worsening: …We conditionally recommend treatment with glucocorticoid AND IV CYC, MPAA, anti-CD20 therapy and/or IVIG over glucocorticoid monotherapy.

Make note that according to ACR, MTX is not listed as a steroid sparing option.  
`;

// Parse into blocks
const blocks = rawData.split(/Question:\s*/i).filter(b => b.trim().length > 0);
let formattedRows = [];

for (const block of blocks) {
    const parts = block.split(/Ans:\s*/i);
    if (parts.length < 2) continue;

    let qText = parts[0].trim().replace(/\r?\n/g, '<br>');
    // Clean up excessive <br> tags
    qText = qText.replace(/(<br>){3,}/g, '<br><br>');

    let aLines = parts[1].trim().split('\n');

    if (aLines.length > 0 && aLines[0].trim()) {
        aLines[0] = '<b>' + aLines[0].trim() + '</b>';
    }

    let aText = aLines.join('<br>').replace(/<br>(<br>)+/g, '<br><br>');

    const combined = (qText + " " + aText).toLowerCase();
    let category = 'Other';

    if (combined.includes('vaccine') || combined.includes('vaccination') || combined.includes('shingles') || combined.includes('influenza') || combined.includes('pneumococcal') || combined.includes('hpv') || combined.includes('rotavirus')) category = 'Vaccines';
    else if (combined.includes('contracep') || combined.includes('pregnancy') || combined.includes('apl') || combined.includes('neonatal lupus')) category = 'Pregnancy';
    else if (combined.includes('ild') || combined.includes('lung disease') || combined.includes('hrct') || combined.includes('pfts')) category = 'ILD';
    else if (combined.includes('behcet')) category = 'Vasculitis';
    else if (combined.includes('nephritis') || combined.includes(' proteinuria') || combined.includes('renal biopsy') || combined.includes(' kidney') || combined.includes(' class iv') || combined.includes(' class v')) category = 'SLE';
    else if (combined.includes('lupus') || combined.includes('sle') || combined.includes('malar rash') || combined.includes('smith ab') || combined.includes('dsdna')) category = 'SLE';
    else if (combined.includes('rheumatoid arthritis') || combined.includes(' ra ') || combined.includes('methotrexate')) category = 'RA';
    else if (combined.includes('vasculitis') || combined.includes('leukocytoclastic')) category = 'Vasculitis';

    formattedRows.push(qText + '\t' + aText + '\t' + category);
}

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + formattedRows.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended ' + formattedRows.length + ' questions to updatedquestion.txt');
