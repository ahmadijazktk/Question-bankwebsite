import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = `
Question:
A bone lesion at the end of bone (epiphysis) means usually what?
Ans:
Chondroblastoma
Clear-cell chondosarcoma
Giant Cell Tumor

Question:
Bone lesion in the middle of long bone?
Ans:
Either Ewing's, Osteoid osteoma, or osteoblastoma
-Diaphysis

Question:
 What is the treatment of H. pylori if someone is taking colchicine?
Ans:
Quad therapy (b/c you cannot do macrolides)
"TOMB"
-Tetracycline, omeprazole, Metronidazole, Bismuth subsal

Question:
A patient has 1 gout attack per year. What is the treatment?
Ans:
No ULT. Treat acute gout only with anti-inflammatory.
ULT therapy only indicated for at least 1 tophi, at least 2 attacks/year, OR evidence of radiographic damage from gout

Question:
What medications need to be tested for G6PD deficiency?
Ans:
Dapsone
Pegloticase
SSZ (?)
Probenacid

Question:
What is the "terrible triad" of knee injury?
Ans:
ACL tear
Complete medial collateral ligament tear
Meniscal tear

-usually from VALGUS impact to knee with foot firmly planted

Question:
A patient with seropositive Rheumatoid arthritis has metastatic melanoma. Oncologists wants to start a checkpoint inhibitor and is asking you what to do for her RA management. She is currently on MTX, Humira, and prednisone 5mg. RA is stable.
Ans:
Start checkpoint inhibitor.
-stop Humira for now as patient has metastatic melanoma. DO NOT ever withhold ICI for cancer patients since it could be life-saving.
-attempt to keep prednisone <10mg daily to keep from interfering with ICI.

Question:
A patient with SLE and LN currently on imuran, HCQ, and prednisone gets pregnant. Her medication regimen needs to be optimized. She has worsening renal disease. What medication can you give, and what can you NOT give?
Ans:
Should add tacrolimus/cyclosporin
-cannot add belimumab as ACR guidelines conditionally rec'd against at conception and during pregnancy.

Question:
What can alfafa sprouts do?
Ans:
It can flare SLE
-d/c if you see it

Question:
For RA and C1/C2 subluxation, describe what you would see on xray?
Ans:
Odontoid and arch (lateral view) > 3mm means risk

>7-8mm is VERY HIGH risk for sublux

Anterior distance > 9mm
Posterior < 14mm

Question:
What can increase colchicine concentration, especially in patients with CKD?
Ans:
Grapefruit joice
Cyclosporine

Question:
Typical EMG findings in myositis?
Ans:
Irritability of myofibrils at REST and needle insertion

Fibrillation potential, positive sharp waves

Short-duration, low-amplitude, complex (polyphasic) potentials on CONTRACTION

Question:
What T-cells are involved with dermatomyositis, seen on muscle biopsy?
Ans:
CD4+
B-cells too

-Perivascular and perimysial area predominate

Question:
What T-cells are involved with PM, seen on muscle biopsy?
Ans:
CD8+, cytotoxic
-similar to IBM, except:
-invasion in endomysial region
-relative sparing of vasculature

Question:
What T-cells are involved with IBM, seen on muscle biopsy?
Ans:
CD8+, cytotoxic
-similar to PM
-rimmed/lined vacuoles (red-rimmed on TRICHROME stain) with inclusion bodies

Question:
Which type of dermatomyositis is known to have an erythematous patch on posterior hard palate?
Ans:
TIF-1 gamma
'red on white patches'

-high association with malignancy

Question:
Aside from calcinosis, what are juvenile NXP2-dermatomyositis patients at risk of having?
Ans:
Gut perforation
-calcinosis
-BUT, NO risk of malignancy (vs. adult NXP2)

Question:
What antibody associated with IBM?
Ans:
Anti-cytosolic 5'-nucleotidase 1A

Question:
What is the name of the study that shows efficacy of nintedanib for myositis-associated ILD?
Ans:
INBUILD trial

Question:
What drugs known to be secondary causes of mitochondrial myopathies?
Ans:
Zidovudine
Clofibrate

Question:
According to ACR guidelines 2021, what is treatment regimen for Takayasu arteritis?
Ans:
HIGH dose GCs, then MTX/AZA

-if not in remission, ADD TNFi
-if still not, then switch to another DMARD (MTX/AZA/TNFi/TCZ)

Question:
According to ACR guidelines 2021, what is treatment regimen for GCA?
Ans:
If visual sx, then use IV pulse GC
If without visual sx, can use oral GC
+
TCZ (in some instances, OK to use MTX)

if still not in remission, "consider adding or changing DMARD(MTX or Abatacept in place of TCZ)"

Question:
What is pathophys of X-linked hypo-phosphatemia?
Ans:
Mutant PHEX gene
-mimics Vit D deficiency and seronegative spondy with sacroiliitis

-diminished Vit-D 1hydroxylase activity--> reduced degradation of FGF23--> phosphate wasting

-TX: Burosumab (anti-FGF23), FDA approved 2018

Question:
What is pirfenidone approved for?
Ans:
ILD, specifically from Rheumatoid arthritis 

Question:
What type of vaccine is varicella?
Ans:
Live
-other Live vaccines: MMR, Yellow fever

Question:
What is treatment for Babesiosis (usually coinfected with Lyme)?
Ans:
Azithromycin + atovaquone
OR
IV clindamycin + oral quinine 7-10 days

Question:
If patient has Anaplasmosis co infection with Lyme, and cannot take doxycycline, what is the treatment?
Ans:
Rifampin 300mg BID 7-10 days

Question:
Young female who runs frequently has 1st MTP pain/swelling.
Ans:
Basic calcium phosphate arthropathy
-"Hydroxyapatite pseudopodagra"

TX: PT and NSAIDs

Question:
What is the histology of LCV?
Ans:
-vessel wall destruction by the infiltration of inflammatory cells within and around the vessel wall can be seen
- Extravasation of red blood cells can be present in the dermis
-fibrinoid necrosis

Question:
Patient has scaphoid fracture. What is treatment?
Ans:
Splint vs referral to hand surgeon
-depends if fracture is non-displaced vs. displaced.

Question:
 What is pathophys of early OA?
Ans:
Swelling of articular cartilage
Loosening of collagen
Increased cartilage water content

LATER:
Degradative enzymes break down proteoglycan
Articular cartilage things/softens
Fissuring/cracking of cartilage
Remodeling/hypertrophy of subchondral bone = "bone spurs"

Question:
What antibody associated with Scleroderma renal crisis?
Ans:
RNA polymerase III

Question:
What is treatment for AxSpa (ankylosing spondylitis) for someone initially on TNFi, had initial good response, but then later had relapse of symptoms?
Ans:
Can try another TNFi, because this is "secondary failure"
-Primary failure = no response at all, therefore in that scenario, switch to IL-17i.

Question:
What is the first line treatment for AxSpa (ankylosing spondylitis)?
Ans:
NSAIDs. Need to try 2 different NSAIDs, 2 weeks each. Then you go to TNFi.

Question:
What is a contraindication to using IL-17i in patients with AxSpa (ankylosing spondylitis)?
Ans:
If they have IBD (UC or Crohn's).

Question:
Based on the 2010 criteria for diagnosing Rheumatoid Arthritis, how many points do you need to make dx?
Ans:
At least 6

Question:
-central area of necrosis, surrounded by palisading macrophages
-and perivascular infiltration of lymphocytes
Ans:
RA nodule

Question:
Discontinuity of bone surface visible in 2 perpendicular planes on US...
Ans:
Erosion on US
-does not differentiate PsA vs. RA

Question:
Abnormal hypoechoic intra-articular tissue that is nondisplaceable and poorly compressible on US...
Ans:
Synovitis on US
-does not differentiate PsA vs. RA

Question:
Hypoechoic swelling of soft tissue surrounding tendon (extensor) on US...
Ans:
Peritendon inflammation (PTI)
-PTI is VERY SPECIFIC to early PsA, ~97%
-absence of PTI does not rule out PsA

Question:
What is the best imaging modality for Takayasu arteritis?
Ans:
MRA

Question:
Which finding on capillaroscopy would be most specific for scleroderma?
Ans:
Capillary diameter greater than 50um
-seen in early and active scleroderma
-normal is up to 50um
-late stages, density will drop below 3 capillaries per linear mm
-care 2021, q58

Question:
On MRI of SI joints, what does subchondral bone resorption with minimal cartilage surface irregularity a hallmark of?
Ans:
Hyperparathyroidism 

Question:
On MRI of SI joints, what does triangular area of sclerosis adjacent to inferior SI joint a hallmark of?
Ans:
OCI, osteitis condensans ilii

Question:
Young male patient with UE weakness. Also with BL sensorineural hearing loss. All MSAs are negative. CK 800. EMG shows mild myopathic changes with low amplitude, short duration and polyphasic potentials.
He has winging of the left scapula....
Ans:
Facioscapulohumeral dystrophy
-3rd most common form of muscular dystrophy
-inappropriate expression of DUX4 gene
-scapular winging***
-sparing of deltoid is unique
-***Beevor sign, upward displacement of umbilicus with neck flexion (weakness of abd muscles)

Question:
Young female, has sudden onset HA. Normal ESR/CRP, and CSF.
CTA Head sows areas of ectasia, stenosis, and beading in multiple vessels.
Ans:
Reversible cerebral vasoconstriction syndrome (RCVS)

-"thunder clap headache"
-CRP/ESR should be normal. If they are positive, consider angiitis (vasculitis)

TX: high dose CCBs, supportive care

Question:
For severe, active, EGPA, what are the options for induction treatment?
Ans:
High dose IV or oral steroids
RTX
CYC

Question:
In a patient with EGPA who is unable to receive immunomodulatory therapy, what is recommended?
Ans:
IVIG

"conditionally recommend"

Question:
For treatment of remission EGPA, what meds are recommended?
Ans:
With patients with SEVERE EGPA now in remission, can use MTX, AZA, or MMF

Question:
What is treatment of EGPA if a severe relapse occurs?
Ans:
RTX

Question:
What is treatment of EGPA with non-severe relapse?
Ans:
Adding mepolizumab (to their MTX/AZA/MMF maintenance med)

*look at ACR Guidelines for how they define "non-severe vs. severe" symptoms. 

Non-severe = "Vasculitis without life- or organ-threatening manifestations (e.g., rhinosinusitis, asthma, mild systemic symptoms, uncomplicated cutaneous disease, mild inflammatory arthritis)"

Severe = "Vasculitis with life- or organ-threatening manifestations (e.g., alveolar hemorrhage, glomerulonephritis, central nervous system vasculitis, mononeuritis multiplex, cardiac involvement, mesenteric ischemia, limb/digit ischemia)"

Question:
For patients with EGPA, what testing is conditionally recommended at time of diagnosis?
Ans:
Cardiac TTE

Question:
For patients with EGPA who are receiving RTX/CYC, is there any prophylaxis medication that is recommended?
Ans:
Yes, 
Bactrim for PJP prophylaxis.

Provide Bactrim up to 6 months after last RTX dose. 

Question:
For GPA/MPA, is PLEX recommended?
Ans:
No it is not. 
For active glomerulonephritis/alveolar hemorrhage, it is recommended AGAINST

-from PEXIVAS trial
-also from ACR


Question:
If a patient with GPA/MPA has a severe relapse, which med is recommended?
Ans:
RTX (over CYC)

Question:
For patients with GPA/MPA receiving remission maintenance therapy with rituximab who have hypogammaglobulinemia (e.g., IgG <3 gm/liter) and recurrent severe infections, we conditionally recommend......?
Ans:
IVIG

Question:
What is conditionally recommended for remission induction for active, nonsevere GPA?
Ans:
MTX + GCs

Question:
What are 3 medications used to block IL-1Beta?
Ans:
Anakinra (IL-1Ra, exogenous form of naturally made IL-1Ra), short-lived
Canakinumab - classic MAB against IL-1B, LONG half-life
Rilonacept - extracellular portion of IL-1R that is fused to Fc

Question:
What does V.E.X.A.S. stand for?
Ans:
VEXAS syndrome (Vacuoles, E1 enzyme, X-linked, Autoinflammatory Syndrome)
-mutation in UBA1 gene on X chromosome
            -present ONLY in MONOCYTES   
                -means there is NO family history (aka. De novo mutation)
               

Question:
Name 2 important reasons why IL-6 is an important inflammatory mediator
Ans:
-makes Th-cells  to become Th17 cells which produce IL-17 (and others)
    -AND it BLOCKS Th-cells from becoming T-reg cells (which is IMMUNE regulation/SUPPRESSION)
        -***therefore Tocilizumab INCREASES T-reg cells and blocks Th17 cells

Question:
What is the MOA of ipilimumab?
Ans:
blocks CTLA-4

Question:
What is MOA of nivolumab?
Ans:
block PD-L1

Question:
What is MOA of pembrolizumab?
Ans:
block PD-L1

Question:
What is FDA approved for oral ulcers in Behcets?
Ans:
Apremilast

Question:
What is the treatment for recurrent clots in Behcets?
Ans:
patient needs IMMUNOSUPPRESSION
-Steroids +/- AZA or CYC
-anticoagulation is controversial

Question:
What disease should you think of in a middle age male with RP + myelodysplastic syndrome?
Ans:
VEXAS

Question:
What is the HLA associated with increased risk of ILD in Rheumatoid arthritis patients?
Ans:
HLA-DRB1-1502

Question:
What is the mechanism that increases Rheumatoid arthritis severity in smokers?
Ans:
smoking accelerates deamination of arginine to citrulline by up regulation of PAD4 enzyme

Question:
What did the CANTOS trial show?
Ans:
IL-1 blockade (canakinumab) + traditional blockage prevented CVD events in recent MI population

Question:
Which DMARD is recommended for mild Rheumatoid arthritis disease? 
Ans:
HCQ or SSZ

Not MTX for mild disease. Only for moderate to severe. 

Question:
"Triple therapy" is recommended as essentially equal to MTX + bDMARD....True of False?
Ans:
False

MTX + bDMARD shows better outcomed with ACR50, with better tolerability. 

Question:
What is one way to differentiate Dengue viral arthritis vs. Chikungunya arthritis?
Ans:
Dengue will NOT have synovitis
CHIK will have synovitis 

*Dengue will also have BLEEDING and RETROORBITAL PAIN

Question:
What virus causes a relative bradycardia with respect to fever?
Ans:
Yellow Fever

Question:
What bacterial arthritis comes from a rat bite (or inhestion of food/water with rat feces), and leads to an inflammatory polyarthritis, with fever and rash?
Ans:
Streptobascillus monoliformis (Spirillum minus)

Question:
Describe the types of cryoglobulinemic vasculitis
Ans:
Type 1: isolated monocloncal immunoglobulin

Type 2: IgG and IgM RF of monoclonal origin

Type 3: IgG and polyclonal IgM-RF

Question:
A patient develops new left sided weakness. Has been receiving RTX for ANCA vasculitis. 
CSF is normal, with only mildly increased protein. 
MRI brain shows hypointense subcortical white matter lesions on T1. 
Angiography of brain is normal. 
What is this?
Ans:
PML caused by latent JC polyomavirus 
-often progressive and FATAL
-usually occurs in HIV, and immunosuppressed
-angiography is normal. PCR of CSF for PML is how to diagnose (also brain biopsy)
TX: reversal of immunosuppression

Question:
What is the effect of Tocilizumab on Th cells?
Ans:
Increases T-reg cells
Blocks Th17 cells

Question:
What do malignant tumors do to T-cell activation?
Ans:
Tumor cells make T-cells UPREGULATE PD-1 and CTLA-4 (these are the molecules that naturally block the co-stimulatory signal....therefore, this allows the tumor to keep growing)

-Checkpoint inhibitors (CIs) allow binding of the co-stimulatory molecules, therefore they "wake up" the T-cell to attack the tumor and shrink them (aka, they are PRO-immune, and can lead to autoimmune adverse reactions) 

Question:
What is the enzyme(s) involved in the production of ACPAs?
Ans:
PAD4 enzymes
-which citrullinates residues on proteins (Histones and Vimentin)
-produces anti-CCP (ACPA)

Question:
What is the difference(s) between ustekinumab and risankizumab?
Ans:
Ustekinumab block p40 subunit of IL-12 AND IL-23
Risankizumab blocks only IL-23 (the p19 subunit)

-therefore, risankizumab blocks only Th17 proliferation, while ustekinumab blocks Th1 AND Th17 proliferation

Question:
What is the unique regulatory mechanism involved with the cytokine IL-1Beta? 
Ans:
The Inflammasome

Question:
IL-1Beta and the inflammasome are inflammatory pathways involved with what 2 unique diseases? 
Ans:
Gout and CAPS (cryopyrin-associated periodic fever syndromes)

Question:
What is the gene involved with Haplo-insufficiency A20, which is a disease involved with dysregulation in the IL-1/inflammasome mechanism?
Ans:
TNFAIP3

Question:
What are the 3 CAPS disease (cryopyrin-associated periodic fever syndromes)?
Ans:
FCAS (Familial Cold autoinflammatory syndrome)
MWS (Muckle-Wells Syndrome)
CINA/NOMID (Chronic Infantile Neurologic Cutaneous and Arthritis Syndrome)

-all involved with Autosomal Dominant, Gain of Function mutation in NLRP3....which codes for the protein Cryopyrin

Question:
Of the different CAPS syndromes, which is considered the most severe?
Ans:
CINCA/NOMID (Chronic Infantile Neurologic Cutaneous and Arthritis Syndrome)
-a unique symptom for this syndrome is epiphysial bony overgrowths

Question:
What is the triad associated with Blau Syndrome?
Ans:
Granulomatous rash
Uveitis
Arthritis

-A.D. mutation in NOD2
-look for many family members with same symptoms
-this is NOT a periodic fever syndrome

Question:
In a patient with moderate disease activity and is naive to any treatment for Rheumatoid arthritis, what is the 1st line rec'd?
Ans:
MTX monotherapy

-not MTX + bDMARD

Question:
What is the CDAI score for rheumatoid arthritis that signifies at least moderate disease activity?
Ans:
>10 and ≤22

-this means that a score of 11 in a DMARD naive patient needs to receive MTX monotherapy per ACR guidelines

Question:
For Rheumatoid arthritis, which DMARD is conditionally rec'd over other DMARDs for mild disease activity in treatment-naive patients?
Ans:
HCQ

-MTX only for moderate-severe

Question:
In a Rheumatoid arthritis patient with moderate disease activity who is treatment-naive, the 1st line treatment is............?
Ans:
ORAL Methotrexate (not SubQ)

Question:
If a Rheumatoid arthritis patient on adequeate dosing of Methotrexate oral therapy persists with disease activity, what is next best step?
Ans:
Switching to SubQ MTX (over additional/switching to other DMARD)

-"Conditionally rec'd" per ACR

Question:
If a patient is on 12.5mg/week of Methotrexate and daily folic acid for Rheumatoid arthritis, aside from routine blood monitoring, what is next best step in management at their next office visit?
Ans:
Increase MTX dose to at least 15mg/week (best to get to this dose within 4-6 weeks of initiation)

-"Conditionally rec'd"

Question:
Once oral or subQ MTX is optimized and patient persists with disease activity, what is next best step?
Ans:
Split dosing of oral/subQ (and/or) increase of folic acid is recommended OVER switching to alternative DMARD 

-"Conditionally rec'd"

Question:
If a patient is being treated with Humira for Rheumatoid arthritis for past 6 months and is not at target, what is next best step?

A) Continue with Humira for another 6 months
B) Switch to Enbrel
C) Switch to Orencia
D) Add prednisone
Ans:
Switch to Orencia

-because per ACR, switching to a bDMARD or tsDMARD of a DIFFERENT CLASS is "Conditionally rec'd" over staying in same class with patients not at target

Question:
If patient is taking HCQ + SSZ together for Rheumatoid arthritis and is doing well, and is wanting to decrease her medication, what is next best step?
Ans:
Gradual discontinuation of SSZ
-continue the HCQ

-"Conditionally rec'd"

Question:
If a patient is taking Methotrexate + bDMARD and is doing well, and wants to decrease medication load, what is next best step?
Ans:
Gradual discontinuation of MTX over discontinuing the bDMARD

-"Conditionally rec'd"

Question:
If a patient with Rheumatoid arthritis has moderate disease activity, but also with history of mild/stable lung disease, what is best treatment?
Ans:
MTX
Methotrexate is "conditionally recommended" over alternative DMARDs for the treatment of inflammatory arthritis for patients with clinically diagnosed MILD and STABLE airway or parenchymal lung disease, or incidental disease detected on imaging, who have MODERATE-TO-HIGH disease activity 

Question:
A patient with newly diagnosed Rheumatoid arthritis has moderate disease activity. She knows she previously had Hep B infection, but cannot remember anything about her treatment for it. She also has lymphoma.
What is next best step? (This is tricky, but you have all the information you need)
Ans:
Prophylactic antiviral therapy (for Hep B)
-because, 1st line choice for RA treatment in this patient is RTX (per guidelines, given history of lymphoma), and you were told she had previous Hep B infection (meaning she will definitely have at least the Hep B CORE antibody be positive)
-THUS, patients who are going to receive RTX, AND who are Hep B Core antibody positive ALL must receive ANTIVIRAL treatment prior to starting RTX

Question:
A patient with Rheumatoid arthritis and history of heart failure is not at target with Methotrexate monotherapy. What is next best step?
Ans:
Addition of non-TNFi bDMARD or a tsDMARD

-technically, any patient with NYHA Class III or IV heart failure should not receive TNFi
-"Conditionally rec'd"

Question:
A patient with newly diagnosed Rheumatoid arthritis (Moderate-high disease activity) has nonalcoholic fatty liver disease. Recent LFTs are normal. No evidence for cirrhosis. 
What is best DMARD?
Ans:
Methotrexate
-it is safe as long as LFTs are normal, and no evidence of liver fibrosis
-"Conditionally rec'd"

Question:
Which bDMARD/tsDMARD is "conditionally rec'd" for patients with Rheumatoid arthritis who also have nontuberculous mycobacterial lung disease with moderate-high disease activity despite csDMARDs?
Ans:
Abatacept

Question:
A patient on Methotrexate monotherapy for Rheumatoid arthritis is not at target and has moderate disease activity. Patient has history of serious infection 10 months ago. What is next best step?
Ans:
Addition of csDMARDs
Addition of csDMARDs is "conditionally recommended" over addition of a bDMARD or tsDMARD for patients with a serious infection within the previous 12 months who have moderate-to-high disease activity despite csDMARD monotherapy 
`;

// Parse into blocks
const blocks = rawData.split(/Question:\s*/i).filter(b => b.trim().length > 0);
let formattedRows = [];

for (const block of blocks) {
    const parts = block.split(/Ans:\s*/i);
    if (parts.length < 2) continue;

    let qText = parts[0].trim().replace(/\r?\n/g, '<br>');
    qText = qText.replace(/(<br>){3,}/g, '<br><br>');

    let aLines = parts[1].trim().split('\n');

    if (aLines.length > 0 && aLines[0].trim()) {
        aLines[0] = '<b>' + aLines[0].trim() + '</b>';
    }

    let aText = aLines.join('<br>').replace(/<br>(<br>)+/g, '<br><br>');

    const combined = (qText + " " + aText).toLowerCase();
    let category = 'Other';

    if (combined.includes('jia') || combined.includes('juvenile')) category = 'Pediatrics';
    else if (combined.includes('rheumatoid arthritis') || combined.includes(' ra ') || combined.includes('ra nodule') || combined.includes('methotrexate') && combined.includes('rheumatoid')) category = 'RA';
    else if (combined.includes('lupus') || combined.includes('sle') || combined.includes('aps') || combined.includes('antiphospholipid')) category = 'SLE';
    else if (combined.includes('gout') || combined.includes('colchicine') || combined.includes('uric') || combined.includes('ult ') || combined.includes('calcium phosphate')) category = 'Crystal';
    else if (combined.includes('vasculitis') || combined.includes('gpa') || combined.includes('mpa') || combined.includes('egpa') || combined.includes('takayasu') || combined.includes('gca') || combined.includes('pml') || combined.includes('cryoglobulin') || combined.includes('lcv')) category = 'Vasculitis';
    else if (combined.includes('osteoporosis') || combined.includes('frax') || combined.includes('bisphosphonate')) category = 'Osteoporosis';
    else if (combined.includes('osteoarthritis') || combined.includes(' oa') || combined.includes('pathophys of early oa')) category = 'Osteoarthritis';
    else if (combined.includes('psoriatic') || combined.includes('psa') || combined.includes('peritendon')) category = 'PsA';
    else if (combined.includes('ankylosing') || combined.includes('axspa')) category = 'SpA';
    else if (combined.includes('scleroderma') || combined.includes('ssc') || combined.includes('capillaroscopy')) category = 'SSc';
    else if (combined.includes('myositis') || combined.includes('myopathy') || combined.includes('dermatomyositis') || combined.includes('ibm') || combined.includes('emg') || combined.includes('dystrophy') || combined.includes('muscle biopsy')) category = 'Myositis';
    else if (combined.includes('behcet')) category = 'Vasculitis';
    else if (combined.includes('vexas') || combined.includes('caps') || combined.includes('inflammasome') || combined.includes('blau') || combined.includes('autoinflammatory')) category = 'Autoinflammatory';
    else if (combined.includes('lyme') || combined.includes('babesiosis') || combined.includes('anaplasmosis') || combined.includes('infection') || combined.includes('dengue') || combined.includes('yellow fever') || combined.includes('chikungunya') || combined.includes('rat bite')) category = 'Infection';
    else if (combined.includes('il-1') || combined.includes('il-6') || combined.includes('il-17') || combined.includes('tocilizumab') || combined.includes('checkpoint') || combined.includes('moa') || combined.includes('dmard') || combined.includes('pirfenidone') || combined.includes('vaccine')) category = 'Medications';
    else if (combined.includes('complement') || combined.includes('immunology') || combined.includes('pad4') || combined.includes('acpa')) category = 'Immunology';
    else if (combined.includes('bone lesion') || combined.includes('epiphysis') || combined.includes('diaphysis')) category = 'Orthopedics';
    else if (combined.includes('knee') || combined.includes('ankle') || combined.includes('fracture') || combined.includes('tendon')) category = 'PhysicalExam';
    else if (combined.includes('ild')) category = 'ILD';
    else if (combined.includes('gene') || combined.includes('phosphatemia')) category = 'Genetics';
    else if (combined.includes('methotrexate') || combined.includes('mtx')) category = 'RA';

    formattedRows.push(qText + '\t' + aText + '\t' + category);
}

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + formattedRows.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('Done! Appended ' + formattedRows.length + ' questions to updatedquestion.txt');
