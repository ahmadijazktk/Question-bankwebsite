import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = `
Question:
Which complement factors are deficient in SLE?
Ans:
C2, C4, c1q.
-homozygous C2 deficiency is the most common
-if its C4 deficiency, needs to be deficient in both C4a and C4b.
-***in SCLE, when C2 deficient, presents typically with low ANA (1:40), negative dsDNA, but SSA is positive in 50%***

Question:
What are the most common bacteria that can lead to Reactive arthritis?
Ans:
Chlamydia, Salmonella, Shigella, Campylobacter, and Yersinia

Question:
What is initial treatment for JIA polyarthritis?
Ans:
MTX (subq), then TNFi
-IAGCs conditionally rec'd (Triamcinolone hexacetonide ***STRONGLY rec'd*** over triamcinolone acetonide)
-Bridging with oral GCs (<3 months) during initiation of escalation with *high or moderate* disease conditionally rec'd
-Bridging with oral GCs (<3 months) during initiation of escalation with conditionally rec'd AGAINST in *low disease activity*

Question:
What is treatment for JIA-sacroiliitis?
Ans:
NSAID (***STRONGLY rec'd***), then TNFi (***STRONGLY rec'd***)
-strongly rec'd AGAINST using MTX monotherapy

Question:
What is treatment for JIA-enthesitis?
Ans:
NSAID (***STRONGLY rec'd***) , then TNFi
-TNFi conditionally rec'd over MTX or SSZ
-bridging therapy with oral GCs <3 months during initiation or escalation is conditionally rec'd (most useful if **high disease activity**)

Question:
If patient has JIA-sacroiliitis and did not tolerate TNF, what is another option?
Ans:
SSZ

Question:
For JIA polyarthritis, can you use a biologic monotherapy?
Ans:
Yes, but conditionally rec'd to use DMARD + biologics
-***and STRONGLY rec'd to use infliximab + DMARD***

Question:
For JIA and active chronic anterior uveitis (CAU), what is treatment?
Ans:
Prednisolone acetate 1% eye drops
-then add systemic therapy (**SubQ MTX**, then add TNFi)
     -if inadequate response to 1st TNFi (+ MTX), **increase dose/frequency of TNFi** before switching class.
           -after optimizing dose/frequency, ****switch to 2nd TNFi****
               -after failing 2nd TNFi, switch to other bDMARD (**tocilizumab or abatacept**)

Question:
What is treatment regimen for oligoarthritis JIA?
Ans:
Trial of NSAIDs (conditional rec'd) + Injection GCs (***STRONGLY rec'd***)
   -Do NOT USE ORAL GCs
       -csDMARD (***STRONGLY rec'd***) (....conditionally oral vs subQ MTX) after NSAIDs and Injection GCs fail
        -bDMARD ***STRONGLY rec'd*** after inadequate respond to NSAIDs, and/or IAGCs, and at least 1 csDMARD (MTX)

-***OLIGO = ≤4 joints***

Question:
What is the treatment regimen for TMJ JIA?
Ans:
Trial of NSAIDs (conditional rec'd) + Injection GCs (conditionally rec'd)
   -***Do NOT USE ORAL GCs***
       -csDMARD (STRONGLY rec'd) (....conditionally MTX ) after NSAIDs and Injection GCs fail
        -bDMARD (STRONGLY rec'd) after inadequate respond to NSAIDs, and/or IAGCs, and at least 1 csDMARD (MTX)

-***all this similar to oligo-JIA, aside from STRONG rec'd for IAGCs***

Question:
What is the only difference between management of TMJ JIA and oligo-JIA?
Ans:
Everything the same, except IAGCs ***STRONGLY rec'd*** in oligo-JIA.
-in TMJ-JIA....it is conditionally rec'd

Question:
What is treatment for sJIA (without MAS)?
Ans:
NSAIDs conditionally rec'd as initial monotherapy
-DO NOT USE ORAL GCs
-DO NOT USE csDMARDs
-IL-6 or IL-1 conditionally rec'd as initial monotherapy
    -in incomplete respond to IL-1/IL-6, can use csDMARDs or bDMARDs rec'd over long term use GCs.

Question:
Drug of choice for GIOP or OP treatment in pregnancy?
Ans:
Risedronate, 1st line
-Teriparatide 2nd

-AVOID Denosumab....teratogenic

Question:
A patient has redness pain of eye, double vision, ocular movement impairment with elevated inflammatory markers. MRI of orbit reveals superior oblique enlargement/infiltration/edema. ANCAs are negative.
Biopsy of superior oblique muscle shows granulomatous inflammation, tissue necrosis, and capillaritis.....what is this?
Ans:
GPA
-isolated (non-renal) eye disease will NOT have ANCA positivity.
-the give away is the biopsy.....NECROSIS = GPA

Question:
In SLE, which genetic variants are responsible for dendritic cell Type I IFN production?
Ans:
IRF5, IRAK1, STAT4 genes

Question:
Young female in her 30's, has multiple, red subcutaneous nodules on BLE and BUE that appeared 7 months ago. They do not resolve spontaneously. Asymptomatic.
WBC 3400 (mildly low), neutropenia, and LDH elevated 500s. ANA, smith, dsdna, ro/la all negative.
Biopsy of nodule shows infiltrate of atypical lymphocytes around fat lobules that spares the septaie, overlying dermis and epidermis.
Histiocytes with vacuoles, phagocytized nuclear debris, and ingested lipids seen. Stains for fungi, bacteria, and AFB all negative. Next best step? What is this?
Ans:
Order immunohistochemical stains of biopsy
-this is Subcutaneous panniculitis-like T-cell lymphoma (SPTCL)
-derived from a mature cytotoxic T cell that mimics panniculitis.
-uncommon
-*extremely unusual* for patients to have evidence of lymphoma outside of the subQ tissue

Question:
Male who is 50 years old has PMR like symptoms. Prednisone 20mg daily shows minimal improvement. Has signs of nodular OA in his hands. Easily fatigued. BL shoulder pain wakes him up at night. Does not know if he has lost weight, but has decreased appetite.
No temporal TTP or symptoms to suggest GCA.
Hgb 9, ESR 35, MCV 72.
Why is this patient not improving on prednisone?
Ans:
He has underlying malignancy.
-too young for PMR
-Malignancy-associated PMR most commonly seen with cancer of kidney, lungs, or colon with multiple myeloma.

Question:
An overweight male experiences sudden ankle pain while playing basketball. He felt it while jumping up.
Ans:
Achilles tendon rupture
-do the Thompson test....calf-squeeze. Absence of plantar flexion is positive test.

Question:
What does anterior drawer maneuver of ankle assess?
Ans:
Integrity of the anterior TALOFIBULAR LIGAMENT.

Question:
Which tendon of the ankle is a powerful inverter, and if not working what happens? Where is it located?
Ans:
Posterior tibialis tendon RUPTURE
-located along MEDIAL malleolus, used for inversion
-usually in middle aged women with RA who are obese
-***Positive single-heel rise test***, just like flexor hallucis longus....cannot rise onto ball of affected foot with contralateral foot off ground.

-peroneal tendon rupture is along LATERAL ankle, for EVERSION

Question:
What is MOA of denosumab?
Ans:
Inhibition of OSTEOCLAST differentiation
-MAB against RANKL. RANKL + interaction with RANK = activation/migration/differention of osteoclasts.

Question:
What happens downstream of activated JAK3?
Ans:
Activation of STATs and mediation of IL-2 dependent proliferation
-differentiation in to Th2 cells.

Question:
Ballet dancer has right ankle pain. Start around mid to lower leg along fibula, and extends to medial ankle. She cannot stand on her right toes as well 2/2 pain. She has hallux valgus (bunion).
Forced plantar flexion of great toe shows good strength, but causes pain. Dx?
Ans:
Flexor hallucis longus tendinopathy
-tendon originates from inferior 2/3 of posterior fibula, inserts on base of distal phalanx of 1st toe.
-innervated by tibial nerve. Mainly served to plantar flex big toe.
-*can be confused with posterior tibial tendinopathy* becuase of location of pain at the posteromedial ankle.

Question:
Patient has weakness or absent voluntary flexion of terminal phalanx of thumb and index finger. No weakness in other muscles. No pain. Dx?
Ans:
ANTERIOR interosseous nerve syndrome
-motor-only nerve
-innervates deep forearms muscles: flexor pollicis longus, flexor digitorum profundus (index and middle finger, and pronator quadratus)
-if patient had COMPLETE AIN palsy, would not be able to function all three of these muscles. This guy had weakness.
-inability of make "O" sign with thumb and index

Question:
Patient has aching pain in proximal, volar forearms with paresthesias radiating to thumb, index, middle, and radial half of 4th finger. Negative Tinel sign. No provocation of symptoms with wrist flexion. No noctural symptoms. Dx?
Ans:
This is Pronator teres syndrome (PS)
-difficult to differentiate from CTS. Main difference is no nocturnal pain and absent Tinel sign (like in CTS).
-this is also MEDIAN NERVE, that's why hard to differentiate

Question:
What are common symptoms of diabetic amyotrophy?
Ans:
Autonomic neuropathy, loss of libido, tachycardia, weight loss, orthostatic hypotension
-rule out radiculopathy with MRI
-subacute scrotal/BLE neuropathic pain
-normal ESR/CRP
-EMC/NCV can look like PAN, but negative inflammatory markers rule out PAN
-TX: treat neuropathic pain, (ie. gabapentin)

Question:
What is another name for IgG4 disease?
Ans:
Mikulicz syndrome
-differs from Sjogren's by absence of ANA (or low), Ro/La, and greater steroid responsiveness
-specifically lesions of head and neck, salivary glands

Question:
What is the MOA that explains the analgesic efficacy of pregabalin?
Ans:
Calcium channel modulation
-binds to alpha-2-delta subunit of voltage-gated Ca channel
-found in the CNS and PNS
-reverses central sensitization by ***reducing calcium influx into neurons.....thereby DECREASING release of stimulatory neurotransmitters (glutamate and substance P)***
-it is FDA approved for fibromyalgia

Question:
Is constrictive pericarditis more common in SLE or RA?
Ans:
RA
-pericardial effusion more in SLE

Question:
What condition causes spherocytes?
What condition causes schistocytes?
Ans:
Spherocytes = autoimmune hemolytic anemia (SLE)
Schistocytes = SSc Renal crisis

Question:
How can pain be aggravated in radial tunnel syndrome?
Ans:
Resisted contraction of muscles that border the PIN
-**resisted supination (supinator muscle)
-**resisted 3rd finger extension (extensor carpi radialis brevis muscle)**
-progressive severe compression of the PIN can later lead from Radial Tunnel Syndrome --> Posterior Interosseous Neuropathy syndrome
      PIN syndrome = motor weakness (finger extension and thumb abduction).....typically more weakness than pain

Question:
Describe cubital tunnel syndrome, where it is located, and what muscles are involved
Ans:
Medial elbow
-ULNAR nerve compression
-Proximal edge of the Flexor carpi ulnaris muscle ("Osborne band")
-and.....an enlarged Anconeous epitrochlearis muscle
-clinically, can have sensosry loss/paresthesias over 4th/5th fingers

Question:
Which is/are the most commonly torn rotator cuff muscle/tendon?
And, what does that muscle do in terms of movement?
Ans:
Supraspinatus
-test via Empty Can
-elevates shoulder

Question:
Which is/are the only rotator cuff muscle/tendon involved in INTERNAL ROTATION of shoulder?
Ans:
Subscapularis
-it is the largest of the 4
-test via **Gerber's test aka Lift-off-Test** (dorsum on hand on back, push against resistance)

Question:
Which is/are the rotator cuff muscle/tendon involved with external rotation?
Ans:
Teres minor and Infraspinatus

Question:
Treatment of prosthetic joint infection 3 months or less?
Ans:
Debridement, prolonged IV abx

Question:
Treatment of prosthetic joint infection 3-24 months or more?
Ans:
Removal of prosthesis, area debrided, followed by implantation of abx spacer. THEN, new prosthesis is placed after 6 weeks of IV abx

Question:
What is the difference between Bone Marrow Edema Syndrome (BMES) and osteonecrosis?
Ans:
BMES is of the femoral head AND neck (on MRI)
ON is only the femoral head (on MRI)

Question:
Does Posterior Interosseous neuropathy cause more pain or more weakness?
Ans:
More weakness
-purely MOTOR
-EXTENSORS

Question:
What nerve is affected in Pronator Teres syndrome?
Ans:
Median nerve
-does not affect thumb. If patient cannot extend thumb, then it is PIN

Question:
If a patient that appears to have sarcoid is NOT improving with steroids, what other diagnoses should you consider?
Ans:
Castleman's
Malignancy

Question:
What is the GC adjusted FRAX score for High risk?
Ans:
MOF ≥ 20% but , <30%
OR
Hip ≥ 3% but < 4.5%

TX: strongly rec'd ('over no treatment')
Conditionally recommend DEN or PTH/PTHrP over BP

Question:
What places a patient at Very High risk for OP?
What T score?
Ans:
Prior OP fracture
OR
MOF ≥ 30%
OR
Hip ≥ 4.5%
OR
≥30mg/day prednisone for ≥30 days..... OR....... ≥ 5g/year total dose
OR
T score ≤ -3.5

TX: Conditionally rec'd PTH/PTHrP over anti-resorptive

Question:
What places a <40 year old adult at Moderate Risk for osteoporosis?
Ans:
BMD Z-score ≤ -3*
OR
Significant Bone loss over 1-2 years IN ADDITION TO,  GC ≥ 7.5mg/day for ≥ 6 months

TX: Conditionally rec'd oral BP, IV BP, DEN, PTH/PTHrP
Conditionally rec'd AGAINST RAL, and ROM (due to potential harms except for those intolerant to other agents)

Question:
What places an adult ≥40 years old at Moderate Risk for osteoporosis?
Ans:
GC-adjusted FRAX of MOF ≥10% and <20%
OR
Hip ≥1% but < 3%
OR
***BMD T score between -1 and -2.4***

Question: 
Does pregnancy cause a normally thrombophilic or thrombocytopenic state?
Ans:
Thrombophilic (High PLT)
-also, immunocompromised state, anemia, elevated ESR/CRP
-CTS (2nd-3rd trimester)
-TRANSIENT osteoporosis of the hip
-osteonecrosis of the hip

Question:
How soon before conception (for mother) should MTX be stopped?
Ans:
1-3 months prior to conception

Question:
Is SSZ safe for pregnant women?
Ans:
Yes, but SHOULD also get Folate

Question:
If a patient with RA on Humira (or any TNFi) get pregnant, what should you do?
Ans:
Continue the TNF during pregnancy during ACTIVE disease

Question:
Are women with SLE likely to flare during pregnancy?
Ans:
40-65% of women may flare during pregnancy
-occurs mainly after the 1st trimester

Question:
How soon should a patient planning to get pregnant, if they are on MMF, transition to azathioprine?
Ans:
6 months prior to conception

Question:
Is Tacrolimus safe in pregnancy?
Ans:
Yes, may be viable alternative to MMF

Question:
Is RTX considered safe in pregnancy?
Ans:
Yes, continue during pregnancy if severe life or organ threatening disease
-*dosing in 2nd half of pregnancy puts fetus at risk of having minimal B cells at delivery*

Question:
What types of PsS are risk factors for PsA?
Ans:
Scalp PsS
Inverse PsS
Nail PsS
-other Risk Factors: Obesity, 1st degree relative of PsA

Question:
Per the Caspar criteria, how many points are needed to make dx of PsA?
Ans:
≥3 points

Question:
If a patient has unilateral Acute Anterior Uveitis, what should be ruled out first?
Ans:
Herpetic Infection

Question:
What is an important histologic feature of scleromyxedema?
Ans:
Sparing of epidermis (distinguishes from scleroderma and morphea)

Question:
What scleroderma ab is associated with higher risk of digital ulcers?
Ans:
Anti-fibrillarin (U3)

Question:
What scleroderma ab is associated with pericarditis?
Ans:
Anti-fibrillarin (U3)

Question:
What scleroderma ab is associated with severe lower GI disease?
Ans:
Anti-fibrillarin (U3)
-not severe pulmonary disease

Question:
What is Th/To ab associated with?
Ans:
Scleroderma lung fibrosis

Question:
What autoimmune neuro disease seen in young males, with bilateral optic neuritis?
Ans:
MOG-IgG associated encephalomyelitis
-need LP, which usually shows no oligoclonal IgG bands (distinguishes from MS)
-more common in children (males)
-they have neuro-psych symptoms
-associated with Acute Disseminated Encephalopathy (ADEM)

Question:
What autoimmune neuro disease presents DISTINCTLY in females around 40 years old, severe unilateral optic neuritis, and transverse myelitis? Looks like MS but is not.
Ans:
AQP4-antibody disease (NMO)
-not associated with ADEM

Question:
What autoimmune neuro disease DOES NOT have optic neuritis, but with HAs, acute psych symptoms/behavioral changes and pleocytosis/oligoclonal bands on CSF?
Ans:
NMDA-associated disease
-requires detection of IgG to GluN1 (NR1) of NMDA receptor in CSF/serum


Question:
What nerve involved with Tarsal Tunnel syndrome?
Ans:
Posterior tib nerve
-Tarsal Tunnel Syndrome has +Tinel Test (percussion to posterior medial malleolus)

Question:
What innervates the flexor hallucis longus muscle?
Ans:
Tibial nerve

Question:
What to do for isolated 3rd degree block in fetus in +SSA with/without +SSB ab?
Ans:
Do not treat with dexamethasone
-pacemaker

Question:
What to do for abnormal fetal echocardiography if it shows 1st or 2nd degree heart block?
Ans:
Treat with dexamethasone 4gm daily

Question:
What to do if pregnant female has +SSA without prior infant with heart block or other NLE (neonatal lupus erythematosus)?
Ans:
Serial fetal echo week 16-26
-less frequently than weekly, vs. if there was a history

Question:
What to do if pregnant female has +SSA with prior infant with heart block or other NLE?
Ans:
WEEKLY fetal echo, starting at week 16-18

Question:
What meds should be discontinued in a male who are planning to have a kid?
Ans:
CYC (stop 12 weeks prior to conception).....***STRONGLY rec'd***
-Thalidomide (stop 4 weeks prior to conception)....conditionally rec'd

Question:
For cane left knee, ankle, and hip pain requiring a cane, which hand do you use to hold the cane?
Ans:
If left sided pathology, hold in right hand.
-***only time you use same side is if using stairs***

Question:
What is the most common pulmonary manifestation of Behcets?
Ans:
Pulmonary artery aneurysms

Question:
What is/are the difference between Acute anterior uveitis (AAU) vs. chronic anterior uveitis (CAU)?
Ans:
CAU is usually ASYMPTOMATIC until ocular complications arise
Uncontrolled CAU can lead to synechaie, cataracts, and glaucoma, and vision loss in 10-20% of children

AAU is more associated with HLA-B27 and occurs in children with spondys (ie. enthesis-related or PsA).
AAU is episodic, UNILATERAL, sudden onset of REDNESS, PAIN, and photophobia. Generally it DOES NOT require SYSTEMIC TREATMENT, but rather TOPICAL GCs.

Question:
In terms of FDA approval, which TNFi is/are approved for both nr-AxSpa and AxSpa (rad)?
Ans:
Cimzia only TNFi approved for both
-all the IL-17s approved for both

Question:
What enzyme (overactivity or underactivity) causes hyperuricemia and hyper uricosuria? Severe form may have ataxia, hypotonia, and sensorineural hearing loss.
Ans:
PRPS overactivity
-X-linked (males only)

Question:
If a patient is taking voclosporin and develops acute gout, what dose of colchicine should be used?
Ans:
0.3mg
-should not be given for 3-7 days after the initial 0.3mg dose
-voclosporin can increase colchicine levels

Question:
If a patient has erythromelalgia and responds to aspirin, what does this suggest?
Ans:
They may have an underlying myeloproliferative disorder

Question:
What stain is used to biopsy MRH lesions?
Ans:
Sudan black

Question:
MOA of leflunomide
Ans:
inhibiting the ***mitochondrial enzyme dihydroorotate dehydrogenase (DHODH)***, which plays a key role in the de novo synthesis of the pyrimidine ribonucleotide uridine monophosphate (rUMP)
-***inhibits pyrimidine synthesis***

Question:
"Hairy kidneys" on abdominal imaging in a patient with Retroperitoneal fibrosis should clue to what diagnosis?
Ans:
Erdheim Chester disease

Question:
Which 3 OP meds only work for vertebral fractures?
Ans:
Raloxifene
Calcitonin (rarely used)
Ibandronate

Question:
A lip biopsy with >50 lymphocytes/4mm2 would have what focus score?
Ans:
1

Question:
Which OP med does not cause ONJ?
Ans:
Teriparatide
-PTH analogs

Question:
A patient with Stiff-person syndrome and breast cancer likely to have this antibody?
Ans:
Anti-amphiphysin antibody

Question:
How does Tai chi help knee and/or hip OA?
Ans:
Mind-body practice
-helps with slow, gentle, graceful movements, deep breathing, and relaxation.
-***helps STRENGTH, BALANCE, and FALL PREVENTION, as well as DEPRESSION/SELF-EFFICACY***

Question:
Which joints does Tai-Chi help the most?
Ans:
Knee and hip
-strongly rec'd

Question:
A patient has Tibiofemoral knee OA, what is best treatment?
Ans:
Tibiofemoral knee brace

Question:
Which is strongly rec'd for 1st CMC joint OA?
Ans:
Hand orthosis
-conditionally rec'd for other finger joint OA

Question:
Is acupuncture rec'd for OA, and for which joints?
Ans:
Yes, conditionally 
-for knee, hip, hand

Question:
Which joint are topical NSAIDs STRONGLY rec'd?
Ans:
Knee OA
-conditionally rec'd for hand OA

Question:
Is topical capsaicin cream rec'd, and if so, for which joints?
Ans:
Conditionally rec'd for knee OA
-rec'd AGAINST for hand

Question:
Which joints are oral NSAIDs rec'd?
Ans:
For knee, hip and hand OA
-STRONGLY rec'd

Question:
Which joints are intraarticular GCs rec'd?
Ans:
Knee and hip, STRONGLY
-hand, conditionally rec'd

Question:
Should you use US for hip steroid injection?
Ans:
YES, if available
-STRONGLY REC'D, if available
-but, not required

Question: 
Is duloxetine rec'd for OA?
Ans:
Yes, conditionally.
For knee, hip, hand

Question:
Is tramadol rec'd for OA?
Ans:
Yes, conditionally
-for knee, hip, hand

Question:
Are non-tramadol opioids rec'd for OA?
Ans:
No, conditionally rec'd AGAINST

Question:
Is glucosamine rec'd for OA?
Ans:
No, STRONGLY rec'd AGAINST

Question:
Is HCQ rec'd for OA?
Ans:
No, STRONGLY rec'd AGAINST

Question:
Are intraarticular haluronic acid injection rec'd for OA?
Ans:
No, conditionally rec'd AGAINST for knee and 1st CMC

STRONGLY rec'd AGAINST for hip

Question:
What is the starting steroid dose for PMR?
Ans:
12.5mg-25mg prednisone
-conditionally rec'd
-***STRONGLY rec'd AGAINST starting 30mg/day or more***

Question:
To what dose, and for how long, should steroids be tapered to in PMR?
Ans:
Taper to 10mg/day within 4-8 weeks.

Question:
If a patient with PMR relapses, what dose of steroids should be used?
Ans:
Increase prednisone to PRE-relapse dose and decrease gradually within 4-8 weeks to dose AT WHICH RELAPSE OCCURRED.

Question:
What is name of test to check for bicep's tendinopathy?
Ans:
Yergason
-also, Speed test

Question:
What lab values assist with dx of erythromelalgia?
Ans:
PLT >400
-Secondary has 2 types....ASA sensitive vs. insensitive
ASA sensitive suggests underlying MDS

Question:
What does lobar panniculitis without vasculitis mean?
Ans:
Weber-Christian (relapsing panniculitis)
-remember, only septal is usually erythema nodosum

Question:
What DMARDs can you not use in seronegative RA?
Ans:
Abatacept, RTX, or Tocilizumab

Question:
What is the Neer and Hawkins test? What do they test for?
Ans:
Impingement, specifically subacromial impingement syndrome
-of rotator cuff tendons
-***most commonly the supraspinatus***

Question:
A patient has sJIA. He is transitioning to adult rheum. He was dx at 18 months old. He had MAS before. He was had refractory arthritis thus treated with tocilizumab, but developed an allergic reaction to it so was stopped. PFTs show severely decreased DLCO. CT scheduled.....
Labs show elevated IL-1, +ANA 1:160. Which feature in his history puts at risk for developing sJIA-associated ILD?
Ans:
***History of reaction to Tocilizumab, but also, history of MAS***
other risk factors:
-dx with sJIA before age 2
-prominently elevated IL-18 level
`;

// Parse into blocks - handle both "Question:" and "Qustion:" typos
const blocks = rawData.split(/Q(?:u(?:e|s))?stion:\s*/i).filter(b => b.trim().length > 0);
let formattedRows = [];

for (const block of blocks) {
    const parts = block.split(/Ans\s*:\s*/i);
    if (parts.length < 2) continue;

    let qText = parts[0].trim().replace(/\r?\n/g, '<br>');
    // Clean up excessive <br> tags
    qText = qText.replace(/(<br>){3,}/g, '<br><br>');

    let aLines = parts[1].trim().split('\n');

    // Format answer: The first line becomes bold
    if (aLines.length > 0 && aLines[0].trim()) {
        aLines[0] = `<b>${aLines[0].trim()}</b>`;
    }

    // Re-join answer with <br>
    let aText = aLines.join('<br>').replace(/<br>(<br>)+/g, '<br><br>');

    // Determine category
    const combined = (qText + " " + aText).toLowerCase();
    let category = 'Other';

    if (combined.includes('jia') || combined.includes('juvenile')) category = 'Pediatrics';
    else if (combined.includes('lupus') || combined.includes('sle') || combined.includes('dsdna') || combined.includes('aps') || combined.includes('antiphospholipid')) category = 'SLE';
    else if (combined.includes('osteoporosis') || combined.includes('frax') || combined.includes('bisphosphonate') || combined.includes('denosumab') || combined.includes('teriparatide') || combined.includes('romosozumab') || combined.includes('raloxifene') || combined.includes('giop')) category = 'Osteoporosis';
    else if (combined.includes('osteoarthritis') || combined.includes(' oa')) category = 'Osteoarthritis';
    else if (combined.includes('vasculitis') || combined.includes('gpa') || combined.includes('behcet')) category = 'Vasculitis';
    else if (combined.includes('psoriatic') || combined.includes('psa') || combined.includes('caspar')) category = 'PsA';
    else if (combined.includes('ankylosing') || combined.includes('axspa') || combined.includes('spondyloarthrop')) category = 'SpA';
    else if (combined.includes('scleroderma') || combined.includes('ssc') || combined.includes('morphea')) category = 'SSc';
    else if (combined.includes('rheumatoid arthritis') || combined.includes(' ra') || combined.includes('rotator cuff') || combined.includes('seronegative ra')) category = 'RA';
    else if (combined.includes('pmr')) category = 'GCA';
    else if (combined.includes('gout') || combined.includes('uric') || combined.includes('colchicine')) category = 'Crystal';
    else if (combined.includes('pregnan') || combined.includes('conception') || combined.includes('fetus') || combined.includes('fetal')) category = 'Pregnancy';
    else if (combined.includes('nerve') || combined.includes('neuropathy') || combined.includes('tunnel') || combined.includes('neuro')) category = 'Neurology';
    else if (combined.includes('tendon') || combined.includes('rotator') || combined.includes('impingement') || combined.includes('ankle')) category = 'PhysicalExam';
    else if (combined.includes('jak') || combined.includes('moa') || combined.includes('leflunomide') || combined.includes('dmard') || combined.includes('tnfi') || combined.includes('biologic')) category = 'Medications';
    else if (combined.includes('complement') || combined.includes('innate') || combined.includes('sarcoid') || combined.includes('amyloid')) category = 'Immunology';
    else if (combined.includes('panniculitis')) category = 'panniculitis';
    else if (combined.includes('infection') || combined.includes('reactive arthritis') || combined.includes('prosthetic joint')) category = 'Infection';
    else if (combined.includes('myositis') || combined.includes('myopathy') || combined.includes('rhabdomyolysis') || combined.includes('stiff person')) category = 'Myositis';
    else if (combined.includes('gene') || combined.includes('genetic')) category = 'Genetics';

    formattedRows.push(`${qText}\t${aText}\t${category}`);
}

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + formattedRows.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended ' + formattedRows.length + ' questions to updatedquestion.txt');
