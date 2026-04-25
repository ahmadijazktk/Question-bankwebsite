import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = `
Question:
Do all ARB (angiotensin receptor blockers) have a uricosuric effect?

Ans:
NO
-only losartan does. Not a class effect.

Question:
Which antibodies support diagnosis of autoimmune hemolytic anemia?

Ans:
+DAT for IgG and C3

Question:
Besides HCQ, what other medication is known to cause retinal toxicity?

Ans:
Tamoxifen (especially when given with HCQ)

Question:
What medication can accelerate/cause DISH?

Ans:
Isotretinoin

Question:
Of the known statins, which is (are) not metabolized by cytochrome p450 system?

Ans:
Rosuvastatin and pravastatin
-so if someone develops statin myopathy while also taking for example fluconazole, can change to one of these

Question:
Patient found to have Whipple's disease (chronic diarrhea, migratory polyarthritis, weight loss) receives IV ceftriaxone, then transition to oral Bactrim. 2 weeks later develops 102F, with polyarticular effusions. What should you do?

Ans:
Provide prednisone
-this is IRIS, immune reconstitution inflammatory syndrome, that starts after antibiotics
-can start after HIV, leprosy, TB, Whipple's disease, and opportunistic infections in transplant patients.
-***relapse of disease would take a little longer to occur***

Question:
What happens with ABCG2 protein dysfunction?

Ans:
DECREASED extrarenal (aka. in the gut) urate excretion

Question:
JAKi are likely more likely to cause reduced CRP levels compared to other bDMARDs, T or F?

Ans:
True
-but JAKis can increase chance of Zoster, LFTs, and total cholesterol

Question:
Adult with LCV and IgA deposition in dermis. Has renal disease and hematuria. Unable to tolerate high dose steroids. Treatment?

Ans:
RTX (for IgA vasculitis)
-if patient only had skin IgA vasculitis (not renal), could consider dapsone.

Question:
What did PEXIVAS trial prove in regards to steroid tapering for ANCA vasculitis?
Ans:
Pulse steroids followed by 1mg/kg tapered to 5mg daily by 4 months was just as effective as more prolonged taper.
-this also decreased risk of infections, and noninferior

Question:
MRI shows surface fibrillation/irregularity,  partial thickness defect OR full thickness defect and underlying abnormalities in bone.

Ans:
Osteoarthritis

Question:
What disease should you suspect in someone with swollen joints, abdominal pain, and erythema nodosum vs. panniculitis on legs?

Ans:
PPP syndrome
Pancreatitis panniculitis polyarthritis syndrome
-CARE 2021, q45.
-order CT abdomen to check pancreas. Aspiration does not help.
-steroids DO NOT HELP

Question:
In RA, how do fibroblasts communicate with each other?

Ans:
Cadherin-11

Question:
Young child, <5 years old, refusal to walk.
+fever, +conjunctival injection, +rash.
The rash is worse in the groins BL.

Ans:
Kawasaki Disease
-refusal to walk <5 years old is ***KEY***
-fever is usually constant/unremitting (vs. sJIA fevers typically return to normal***)
-LDH can be elevated, 20%
-***TTE and cards consult EXTREMELY IMPORTANT***
TX: IVIG, ASA, Infliximab
If refractory fevers after 2 rounds IVIG, use infliximab

Question:
What feature of RA is most concerning for the development of C-spine subluxation?

Ans:
Presence of peripheral joint erosions

Question:
Most common organism causing septic arthritis in Sickle cell disease

Ans:
Staph aureus

Question:
A patient has hepatosplenomegaly, anemia, thrombocytopenia, and fatty build in in the liver, spleen and bone. AVN found on xray.

Ans:
Gaucher's disease
-reduced function of GLUCOCEREBROSIDASE, aka glucosyleramidase, or acid beta-glucosidase
-Xray legs show "Erlenmeyer flask deformity"
-CARE 2018, q53

Question:
Which HLA has increased risk of Rheumatoid arthritis-ILD?

Ans:
HLA-DRB1-1502

Question:
Physical exam finding of weakness of wrist and all 4 finger extensors, and brachioradialis with preserved triceps means what problem?

Ans:
Radial nerve palsy (not posterior interosseous neuropathy)
-aka "Saturday Night Palsy", from compression against the humerus

Question:
What does Romosozumab prevent (MOA)?

Ans:
Prevents sclerostin from binding to LRP5/6 and blocking Wnt signaling
-results in bone formation

Question:
Name a common scenario that causes lumbosacral plexopathy

Ans:
Well-controlled DM2, often after weight loss

Question:
What is 1st, 2nd line treatment for chilblains?

Ans:
After warming/drying techniques
1st- topical steroids
2nd- CCB (nifedipine 20-60mg daily)
3rd - pentoxifylline, low dose ASA, minoxidil, topical NG, topical tacrolimus

Question:
Describe difference between pansclerotic morphea VS. diffuse cutaneous scleroderma

Ans:
Pansclerotic morphea - starts in TRUNK, spreads. SPARES fingers/toes. Affects MID BACK.

Diffuse cutaneous scleroderma - starts DISTALLY, spreads centrally, DOES NOT AFFECT mid back

Question:
Tender areas usually in a taut band of muscle or fascia?

Ans:
Myofascial pain syndrome

Question:
Patient who lives along Gulf Coast, including Mississippi River, has swelling/joint pain/tenosynovitis. What infectious organism should you expect?

Ans:
Mycobacterium Marinum
-especially if they are already immunosuppressed (ie. for RA)
-fisherman and aquarium cleaners at greatest risk

Question:
In patients with SLE and bullous systemic lupus erythematosus....what unique antibody can be see?
And what is 1st line treatment?

Ans:
-Antibodies against Type 7 collagen
-Dapsone (check G6PD), then RTX
      -do not use steroids

Question:
Which bDMARD has been shown to have a higher MBDA (multibiomarker disease activity) value when compared to CDAI?

Ans:
Tocilizumab

Question:
Name causes of NAAION (nonarteritic anterior ischemic optic neuropathy)

Ans:
OSA
Sildenafil use
HTN history
HLD
Diabetes
-***AAION is almost exclusively from GCA

Question:
What is PFAPA?

Ans:
-Periodic Fever, Aphthous stomatitis, Pharyngitis, and cervical Adenitis
-***MOST COMMON PERIODIC FEVER IN CHILDREN!!!*****
-***CLOCKWORK****....symptoms every 1 month basically. Patient is fine intermittently
-TX: self limited, can do prednisone for acute episodes, but ***TONSILLECTOMY*** is definitive treatment, then colchicine 2nd line.

Question:
Physical exam finding of weakness of middle through small finger extensors with NORMAL thumb abductor...means what?

Ans:
Need to suspect Rupture of finger extensor tendons (from RA)
-aka Vaughn-Jackson Syndrome

Question:
What gene mutation can lead to chondrocalcinosis and pseudogout (especially in younger patients)?

Ans:
ANKH gene (ankylosis protein homolog)

Question:
What cytokine is increased in juvenile localized scleroderma (jLS)?

Ans:
Interferon gamma-induced protein 10 (IP-10)
-also, elevated IFN-gamma
-also, elevated IL-17

Question:
What is a common GI side effect of colchicine in patients with Familial Mediterranean Fever?

Ans:
Lactose intolerance

Question:
What change in HLD, LDL, and Tot chol can be seen with JAKi?

Ans:
Increase in HDL, LDL, and Tot chol
-LDL/HDL ratio stays the same

Question:
Describe SAPHO and treatment

Ans:
Synovitis, Acne, Pustulosis, Hyperostosis, and Osteitis
-anterior chest wall most frequent site
TX: bisphosphonates
-refractory cases, maybe TNFi

Question:
What is the time to maximum effect of Methotrexate in Rheumatoid Arthritis?

Ans:
12 weeks

Question:
What lupus (SLE) meds are associated with increased risk of lymphoma?

Ans:
CYC (cyclophosphamide) and steroids

“Prednisone is poison!” - Dr. Petri


Question:
For patient receiving RTX for GPA vasculitis, what is the recommendation for PJP prophylaxis?

Ans:
Bactrim daily for at least 6 months after last RTX dose
(also Bactrim if prednisone >20mg daily, CARE 2020, q16)

Question:
Is myocardial biopsy to diagnose cardiac sarcoid reliable?

Ans:
No
-imaging is often relied upon (cardiac MRI)

Question:
Which antiphospholipid antibody is associated with increased risk of pHTN?

Ans:
Lupus anticoagulant or anti-aCL IgG in patients with SLE
-this is NOT due to thrombosis
-no association with SLE disease activity either
-RNP is another antibody with increased association

Question:
Pain reproduced at scaphoid with radial deviation while pressing on volar aspect means what?

Ans:
Positive Watson test, which means instability of the scapholunate ligament
-Xray will show more than 3mm between the scaphoid and lunate
-"wrist pain after fall on outstretched hand"

Question:
Describe Familial Mediterranean Fever and treatment

Ans:
-form of HEREDITARY periodic fever syndrome
-Autosomal Recessive
-MEFV gene---> *****PYRIN (not cryopyrin)*****
-****PLAGUE RESISTANCE****
-......think Armenians, Turks, Arabs, Italians
-***lasts 1-3 days***, shortest of all HPFS
-***Amyloidosis***
-TX: Colchicine

Question:
In Rheumatoid Arthritis, what causes bone erosions?

Ans:
RANKL, TNF, and IL-1
-drives OSTEOCLASTS to erode bone

Question:
What is treatment for lyme associated parenchymal involvement of brain or spinal cord?

Ans:
IV (not oral) antibiotics

STRONG REC'D
Question:
Can whipple's disease have ocular manifestation?

Ans:
Yes, PANUVEITIS is most common!

Question:
In patients with ankylosing spondylitis, which location should be used to assess osteoporosis via DEXA?

Ans:
Hip and spine

Question:
Patient s/p hip replacement, c/o chronic hip pain since surgery. Sx for about 1 year. What is it and how to treat?

Ans:
Classic for Cutibacterium (fka. Propionibacteirum) acnes prosthetic joint infection
-indolent organism (could also be Coag neg staph)
-***ask lab to culture for 7 days***
-likely needs 2 stage hip revision surgery

Question:
What is the MOA of abatacept?

Ans:
Fusion protein composed of Fc region IgG1 fused to extracellular domain of CTLA-4.
Binds to CD80/86 molecule on APC to block T-cell activation

Question:
Describe PAPA and treatment

Ans:
-Pyogenic arthritis, pyoderma gangrenosum, acne

-inflammatory arthritis + acne + pyoderma gangrenosum

-PSTPIP1 gene.....Autosomal Dominant, loss of function

TX: Steroids, IL-1 inhibitors (Anakinra), TNFi, tacrolimus

Question:
What should you expect in a patient 60-80 years old, seronegative, with sudden palmar fasciitis and polyarthritis?

Ans:
Malignancy
-in women, get US pelvis (ovarian carcinoma)

Question:
What is the critical shoulder angle (CSA) and how is it used?

Ans:
Used to determine OA of the shoulder
-if less than 30 degree, it means shoulder OA

Question:
What gene associated with Marfan syndrome?

Ans:
FBN1 on chromosome 15q21.1
-UPWARD lens for Marfans
(downward is for Homocysteine)

Question:
In patients with GCA, which feature is most predictive of future aortic aneurysmal dilatation?

-persistently elevated ESR, Females, previous smoking hx, or DM2 history?


Ans:
Previous smoking history
-can increase by 2-fold
-***a study (around 2016) showed increased risk with NORMAL CRP/ESR, not elevated

Question:
What did ALMS trial show (2008)?

Ans:
MMF not superior to IV cyclophosphamide for induction remission at 6 months, but better results with NON-whites, and NON-asians

Question:
What does loss of velocity on NCV/EMG mean?

Ans:
Demyelination
-loss of amplitude = axonal problem
Question:
-Young female with inflammatory infiltrate of SubQ adipose tissue that comes and goes
-Bx shows inflammation in adipose tissue, both in septal and lobular pattern, mononuclear cell infiltrate with multiple fat laden macrophages without any vasculitis.

Ans:
Weber Christian disease (WCD)
-aka Relapsing Febrile Nodular Panniculitis
-remember that erythema nodosum does not have inflammation in lobule, but rather only septal

Question:

A young male who lives in Texas has left buttock pain. FABER +. Also with low fevers, chills, night sweats, and weight loss, over 2 months. He ate local foods in rural Mexico recently, but also went to brothel (no STD symptoms). Hepatomegaly. What is the probable cause of sx?

Ans:
Brucella melitensis
-Low WBC count, **hepatomegaly**,and weight loss are key.
-***transmission via consumption of infected ANIMAL milk products (unpasteurized goats milk)***
-also via aerosolized particle inhalation

Question:
What GYN disease are SLE patients at risk of getting (females)?

Ans:
SIL, squamous intraepithelial lesions
-increased with CYC and persistent-high risk HPV infection

Question:
What xray findings can be seen with chronic venous stasis?

Ans:
Fixed plantar flexion, periostitis, contracture of ankle joint, and calcifications in the tibiofibular membrane

Question:
Describe CINCA/NOMID 

Ans:
Neonatal-onset multisystem inflammatory disorder (aka Chronic infantile neurologic cutaneous articular)

-form of CAPS (encoding NLRP3)....the most SEVERE form
-Epiphyseal bony overgrowth (***big knees***)
-HIVES....like the other CAPS
-SN hearing loss
-Aseptic meningitis
-Brain atrophy
Question:
What diabetes medication can cause arthritis mimicking Rheumatoid arthritis (seronegative)?

Ans:
DPP4 inhibitors ("gliptins")

Question:
Features of HPP (hypophosphatasia) and treatment?

Ans:
-mutation of tissue-nonspecific alkaline phosphatase (TNSAP)
-leads to increase in EXTRAcellular PPi, PLP, and PEA
-low Alk Phos, this is key***
-loss of adult dentition (no teeth, edentulous)
-recurrent METATARSAL stress fractures that do not heal well
-CALCIFIC PERIARTHRITIS, and CPPD (hx of pseudogout)
-TREATMENT: asfotase alfa (enzyme replacement)

Question:
In Rheumatoid Arthritis, what causes damage to cartilage?

Ans:
Fibroblasts

Question:
What is treatment for lyme carditis?

Ans:
-"suggest oral antibiotics over IV"....this is for outpatient (ACR 2020 guidelines)
-if hospitalized, use IV ceftriaxone
-if patient has evidence of arrhythmia, ADMIT patient and place continuous cardiac monitor

STRONG REC'D

Question:
What is the most common organism to cause pyogenic sacroiliitis?

Ans:
Staph aureus, Group B strep, or Pseudomonas.

Question:
Can you use ustekinumab for both UC and Crohn's?

Ans:
Yes
IL-12/23 blocker.

Question:
Do patients with MPA have granulomatous inflammation on pathology?

Ans:
Typically no.
If patient is MPO+ with cavitary lesions in lungs and pathology with granulomatous inflammation, consider GPA

-RHEUM SECRETs q. e49

Question:
When should patients with Lyme disease be tested for coinfection with A. phagocytophilum or B. microti?

Ans:
High grade fever
Characteristic lab abnormalities (low PLTs, elevated LFTs, low WBCs, anemia)
Can look for intracytoplasmatic inclusions

Question:
What is the name of the radiographic view angle that best assesses the sacroiliac joints?

Ans:
Ferguson

Question:
-Young adult with knee pain. Repeated microtrauma. Sometime single traumatic injury.
-MRI shows focal areas of swelling of patellar cartilage, surface irregularity, areas of thinning and loss of cartilage with subchondral bone exposure

Ans:
Chondromalacia patellae

-associated with WILSON's DISEASE

Question:
Is HCQ ok to give to patients with HIV?

Ans:
HCQ considered safe in HIV patients, particularly if they are on HAART.
-it may accelerate disease if not on HAART
Question:
Describe DADA2 and treatment

Ans:
-Deficiency of Adenosine DeAminase 2
-previously called CECR1
-****VASCULITIS....that looks like PAN*******, typically pediatric cases
-******STROKES!!!*********in a child 
-TX: TNFi

Question:
Do males need to stop taking methotrexate for birth/conception reasons?

Ans:
No

Question:
Describe MWS (Muckle-Wells Syndrome)

Ans:
-form of CAPS, Autosomal Dominant....Gain of Function in NLRP3
-HIVES rash
-conjunctivits, episcleritis, papilledema
-SN hearing loss
-ASEPTIC MENINGITIS
-***Amyloidosis*******

Question:
What GSD does not have the second wind phenomenom?

Ans:
Tarui disease, GSD Type VII (7)
-lack of phosphofructokinase
-carb loading will WORSEN symptoms (vs. McArdle)

Question:
What is the hallmark cell of the innate immune system?

Ans:
Neutrophil
-dendritic cells are the key APCs

Question:
Is CK normal or elevated in HyperThyrodism?

Ans:
Normal

Question:
When is calcium citrate (vs carbonate) favored for Calcium supplementation?

Ans:
If the patient is taking PPi or H2 blockers (omeprazole or famotidine)
-calcium carbonate better absorbed with meals

Question:
What is treatment for lyme associated acute neurologic manifestations (without parenchymal involvement of brain or spinal cord)?

Ans:
IV ceftriaxone, cefotaxime, penicillin G or oral doxycycline. 14-21 days

STRONG REC'D
-------
...if with involvement of brain/spinal cord, STRONGLY REC'D IV over oral antibiotics

Question:
A patient has history of recurrent ankle sprains....which ligament likely affected?

Ans:
Talocalcaneal sulcus
-aka Sinus Tarsi Syndrome

Question:
What is treatment for Lyme arthritis?

Ans:
Oral antibiotic for 28 days

(Strong Recommendation per ACR guidelines)

Question:
What is difference between nodular anterior scleritis and Necrotizing anterior scleritis?

Ans:
Nodular anterior scleritis is PAINFUL
Necrotizing anterior scleritis is PAINLESS
-both can occur from RA that is poorly controlled

Question:
Describe TRAPS and treatment
Ans:
-form of HEREDITARY periodic fever syndrome
-gene:  tumor necrosis factor receptor-1 (TNFRSF1A) gene that encodes the 55-kDa receptor for tumor necrosis factor (TNF) cytokine.
-Autosomal Dominant (the only HPFS that is A.D.)
-aka. Familial Hiberman Fever
-****IRISH******SCOTTISH******
-lasts > 7 days (the longest of all the HPFS)
TX: Anakinra, Canakinumab

Question:
What drug can cause dermatomyositis?

Ans:
Hydroxyurea

Question:
What diabetes med is useful for reducing risk of gout? How does it work?

Ans:
SGLT2 inhibitors (the 'flozins')
-aka Dapaglifozin
-it increases urinary excretion of urate
      -because it competes with glucose reabsorption at GLUT9b transporter....hence less urate absorbed

Question:
What did the SENSCIS trial actually measure with nintedanib?

Ans:
The rate of FVC decline (not DLCO, not mortality risk)
-lower rate in patients receiving nintedanib

Question:
What is Cogan's syndrome typically feature (besides sensorineural hearing loss)?

Ans:
Interstitial keratitis (eye redness, pain, photophobia)
-also, Large Vessel Vasculitis (ie. aortitis)

Question:
Veterinarian with exposure to variety of animals with systemic symptoms including fever, inflammatory polyarthritis, elevated CRP and WBC, and rashes. What is dx?

Ans:
Streptobacillus monoliformis (aka Spirillum minus)
-from RATS

Question:
What virus is associated with increased risk of BLADDER TOXICITY in patient treated with cyclophosphamide?

Ans:
BK virus

Question:
Highest Risk factor for septic arthritis in hemophilia?

Ans:
HIV

Question:
What malignancy are patients with SLE at higher risk of having?

Ans:
Hematologic malignancies
-NON-hodgkin Lymphoma (ie. DIFFUSE LARGE B CELL LYMPHOMA)
-risk greater in males, increases with age

Question:
Does lupus tumidus have panniculitis?

Ans:
No
-remember, it has "EXCESSIVE MUCIN DEPOSITION"

Question:
Patient with ankylosing spondylitis treated with TNFi for 10 years. Has new worsening back pain and paresthesias. Decreased BLE reflexes. MRI shows "outpouching/diverticula" and osteolysis of posterior lumbar spine segments. What is the cause?

Ans:
Ankylosing spondylitis (rare neurologic complication)
-not lymphoma, TB, or metastatic carcinoma
-Outpouching from lumbosacral dural sac.
-pathophys of this not known.

Question:
Most common organism causing osteomyelitis in Sickle cell disease?

Ans:
Salmonella

Question:
What is most common complication in someone with EDS hypermobility type?

Ans:
Autonomic dysfunction
-Orthostatic hypotension or POTS may exist

Question:
What is 1st line treatment of Paget's disease? (with no contraindications)

Ans:
IV zoledronate

Question:
Besides Arava, what other DMARD is known to cause weight loss?

Ans:
Apremilast (Otezla)

Question:
What med can decrease efficacy of MMF?

Ans:
Omeprazole (PPIs)
-can decrease by 25%

-another side note: avoid PPIs in patients with SLE. 
Can be a cause of cutaneous lupus, and exacerbate SLE. 
(Dr. Petri from Johns Hopkins emphasizes this point)

Question:
What is treatment for lyme associated erythema migrans?

Ans:
Oral Doxy 10 days, or 14 days of amoxicillin/cefuroxime

STRONG REC'D

Question:
In someone with arthralgias, developmental delay, restrictive diets, and diffuse multifocal decreased signal on T1 and increased on T2, what would be a test to check for?

Ans:
Vitamin C, it could be scurvy
-mimics leukemia, although no blasts on CBC

Question:
After someone has fragility fracture with surgery repair, how long to initiate osteoporosis treatment?

Ans:
Between 2 weeks and 12 weeks after the event

Question:
Injection of which location can lead to increased pain/recurrence after an initial period of improvement?

Ans:
Lateral epicondylitis

Question:
A patient taking tofacitinib is about to start ketoconazole. What to do with tofacitinib?

Ans:
Reduce dose to 5mg daily. Because of CYP3A4 or CYP2C19 inhibitors. Can lead to increased levels of tofacitinib.

Question:
What is another word for 'trigger finger'?

Ans:
Stenosing tenosynovitis
-involves the flexor tendons, typically in younger patients (older patients more likely to have Dupuytren's contracture)

Question:
A patient with inflammatory polyarthritis. Labs are positive for CCP, RF, and HCV with viremia. Treated with antivirals but still with synovitis. Next best option?

Ans:
TNFi, like Etanercept of Humira
-not RTX, because that is only indicated in HCV associated LCV
-this is essentially RA and HCV together

Question:
What's the difference between Eosinophilia-myalgia syndrome vs. Hypereosinophilic syndrome?

Ans:
EMS does not have end organ dysfunction
HyperEos does

Question:
What would HCV-associated GN look like on histology?

Ans:
MPGN pattern
-thickening of GBM, mild mesangial proliferation, monocyte infiltrate, and subENDOTHELIAL immune complex deposits
-"tram-tracking" or "fingerprint" pattern

Question:
In a patient with decreased TPMT, taking Imuran + allopurinol, which metabolite will be increased?

Ans:
6-thioguanine
-increases risk of myelosuppression
-Care 2013 q10

Question:
What is the active metabolite of azathioprine?

Ans:
6-MP

Question:
What to look for if patient has coinfection Lyme with another pathogen?

Ans:
Elevated LFTs and thrombocytopenia
-likely Anaplasmosis. Patients tend to be sicker than just Lyme.
-***dx by presence of intragranulocytic inclusions on peripheral smear

Question:
Pain with weight bearing, putting on socks/shoes, and TTP anteriorly below the middle of inguinal ligament and lateral to femoral artery?

Ans:
Iliopsoas bursitis
-xrays usually normal

Question:
What is the best test if suspecting oncogenic osteomalacia?

Ans:
Octreotide scintigraphy

Question:
What is the most common manifestation of TNFi induced vasculitis?

Ans:
Cutaneous lesions
-not GN, pulmonary hemorrhage, or neuropathy

Question:
A patient taking HCQ says she sees "halos". What is the eye toxicity?

Ans:
Corneal deposits, which are reversible after stopping HCQ
-loss of red light perception is early
-retinopathy occurs later. With central patchy area of depigmentation of macula. Symptoms include drop out of letters from words when reading, photophobia, blurry vision, flashing lights.

Question:
What is the most common neuro complication of sarcoidosis?

Ans:
Cranial neuropathy
-ie. facial numbness/weakness
`;

const KEYWORDS_TO_CATEGORY = {
    'lupus': 'SLE', 'SLE ': 'SLE', 'HCQ': 'Medications', 'TNFi': 'Medications', 'RTX': 'Medications',
    'RA ': 'RA', 'rheumatoid arthritis': 'RA', 'gout': 'Crystal', 'vasculitis': 'Vasculitis',
    'osteoporosis': 'Osteoporosis', 'myositis': 'Myositis', 'ILD ': 'ILD',
    'psoriatic': 'PsA', 'ankylosing': 'SpA', 'lyme': 'Lyme', 'infection': 'Infection',
    'genetics': 'Genetics', 'pediatric': 'Pediatrics', 'Toxicity': 'Medications'
};

const determineCategory = (qText, aText) => {
    const combined = (qText + " " + aText).toLowerCase();
    for (const [kw, cat] of Object.entries(KEYWORDS_TO_CATEGORY)) {
        if (combined.includes(kw.toLowerCase())) return cat;
    }
    return 'Other';
};

// Parse into blocks
const blocks = rawData.split(/Question:/i).filter(b => b.trim().length > 0);
let formattedRows = [];

for (const block of blocks) {
    const parts = block.split(/Ans:/i);
    if (parts.length < 2) continue;

    let qText = parts[0].trim().replace(/\n/g, '<br>');
    let aLines = parts[1].trim().split('\n');

    // Format answer: The first line becomes bold
    if (aLines.length > 0 && aLines[0].trim()) {
        aLines[0] = `<b>${aLines[0].trim()}</b>`;
    }

    // Re-join answer with <br>
    let aText = aLines.join('<br>').replace(/<br><br>+/g, '<br><br>');
    const category = determineCategory(qText, aText);

    formattedRows.push(`${qText}\t${aText}\t${category}`);
}

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + formattedRows.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log(`✅ Successfully appended ${formattedRows.length} questions to updatedquestion.txt`);
