import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = `
Question:
What mediator linked to obesity has been shown as having a key role in development of osteoarthritis?

Ans:
Adipokines

Question:
What is the most common cause of recurrent rhabdomyolysis in adults and children?

Ans:
CPT II deficiency
-2nd most, McArdle's disease
Care 2012, q1

Question:
If suspecting a metabolic myopathy, when should the muscle biopsy be done?

Ans:
Not at the time of disease activity. Later, when muscle fibers are mature and enzyme levels are reliable

Question:
T or F, erythema nodosum has panniculitis in the septa and lobules.

Ans:
False, only septal

Question:
What disease is associated with Stiff Person syndrome?

Ans:
Type 1 DM
-hyperlordosis of L spine
-woody muscle ridigity

Question:
What CNS vasculitis mimic can be diagnosed by multiple, random, skin biopsies?

Ans:
Intra-vascular large cell lymphoma (ILCL)
-aka, malignant angioendotheliomatosis
-brain biopsy may show "vessel lumens filled with cellular infiltrate"
-also, elevated LDH, ESR, Beta2, and IL-2r. Bone marrow biopsy can be negative
-closely mimics CNS vasculitis, but does not improve with steroids/immunotherapy? (Care 2011, q13)

Question:
What type of arthralgia/arthritis is most commonly seen in Relapsing Polychondritis?

Ans:
Parasternal joint arthritis, about 70% of cases
-sternoclavicular, constochondral, and manuriosternal
-non erosive

***need to suspect VEXAS in male patients with RP***

Question:
What disease has alteration of osteoclastic bone resorption and thickening of cortical and lamellar bone?

Ans:
Osteopetrosis
-underlying MOA is failure of normal osteoclastic bone resorption
-osteoclast proton pump deficiency
Question:
How to tell difference between multiple myeloma and sarcoidosis?
Ans:
MM will not have elevated Vit D like sarcoidosis can

Question:
What effect does cyclosporine have on the kidneys, including histologically?
Ans:
Acute toxicity, which is reversible - reduced renal blood flow, GFR, and increased renal vascular resistance

Chronic toxicity, shows striped fibrosis and ARTERIOLAR HYALINOSIS

Question:
Best imaging to check for cerebral venous thrombosis in a patient with Behcets syndrome?
Ans:
MRV
-MRI can be normal in some cases

Question:
What tendon is typically injured with LATERAL ankle pain?
Ans:
Peroneal tendon

-medial ankle injuries usually Tibialis Posterior Tendon
-Tarsal Tunnel Syndrome is also Medial ankle pain + paresthesiae.





Question:
Aside from labs, what is the definitive way to diagnose Macrophage Activating Syndrome?
Ans:
Bone marrow biopsy

Question:
What is the mutation in osteogenesis imperfecta?
Ans:
COL1A1 gene
-mutation in type 1 collagen alpha-1 and alpha-2 chains mRNA
-***FYI, COL2A1 is Stickler Syndrome

Question:
40 year old patient with several months of right shoulder pain, and decreased ROM. Also with right shoulder and wrist swelling. Has decreased pain and temperature sensation over right wrist. Shoulder X-rays show sclerosis, subluxation and debris. Wrist xray shows destruction of carpal row with bony fragments.
Ans:
Syringomyelia
-example of neuropathic joint
-cavitary lesion within C spine, typically causing cape-like shoulder distribution of loss of pain/temperature
-neuropathic joint occurs in 25% of cases....shoulder being the most common site (~80%)
-xray shoulder: humeral head resorption, osseous debris, sclerosis, swelling

Question:
What autonomic disorder can exist with in patients with Sjogren's?
Ans:
Dysfunction of muscarinic receptors
-M3 receptors are present in lacrimal/salivary glands and involved in ACETYLCHOLINE
-can cause bladder irritability, constipation, low BP, dilated pupils, and autonomic dysfunction related to CHOLINERGIC NEUROPATHY
-***anti-M3 antibodies can exist too!!!!***

Question:
What antibody is associated with Stiff Person syndrome?
Ans:
anti-GAD, glutamic acid decarboxylase
-if Stiff person + hx of breast cancer = anti-amphiphysin

Question:
27 year old male with rash erythematous plaques/papules over back, upper chest, and around ears. No photosensitivity. No drugs. Induration over back. ANA 1:80, dsDNA>300. C3/C4, UA normal. Pathology shows superficial and deep perivascular lymphohistiocytic infiltrates and abundant MUCIN deposition in the reticular dermis.
Ans:
Lupus tumidus
-MUCIN deposition in papillary/reticular dermis is key. No dermo/epidermal (interface) involvement

Question:
Does meralgia paresthetica cause deficits in sensory, motor, or both?
Ans:
Only sensory. And lateral upper leg.
-from Lateral femoral cutaneous nerve

Question:
60 year old male with diabetes has non traumatic right thigh pain for 1 month. Buckling of right knee, with numbness of right thigh. Atrophy of right thigh. No erythema or warmth.
Ans:
Diabetic amyotrophy (ie. polyradiculopathy)
-normal ESR/CRP
-TX: gabapentin, pregabalin. Can use IVIG too, but this will not treat the pain.
-EMG/NCV typically shows long motor unit action potential and fibrillations potentials, reduced muscle action potentials, prolonged F wave latencies

-muscle infarction, on the other hand, will be erythematous, swollen, and very very tender

Question:
Which OSM (oral small molecule) has been shown to work for enthesitis in PsA (psoriatic arthritis)?
Ans:
Apremilast
-the only one (per ACR guidelines)

Question:
What is conditionally rec'd as first line in a diabetic patient who is treatment naive for PsA (psoriatic arthritis)?
Ans:
OSM (oral small molecule), except for MTX

Question:
What is first-line option for treatment naive patient with active PsA (psoriatic arthritis)?
Ans:
TNFi
-can consider OSM in patients with comorbidities, non-severe PsA disease, or who do not want biologics

-"Conditional rec'd"

Question:
If IgA transglutaminase is negative in a patient you strongly suspect has celiac's disease, what should you test next?
Ans:
Check for IgA deficiency
-15x more common in patients with celiac, therefore IgA transglutaminase could be negative in these people.

Question:
What disease has what's known as "raccoon eyes"?
Ans:
Amyloidosis
-purpura around eyes
-can be precipitated by valsalva maneuver

Question:
What type of amyloidosis can occur in patients on HD (hemodialysis)?
Ans:
Beta-2 microglobulin

Question:
SLE patient who initially had arthralgias and class 4 LN. Received IV cyclophosphamide, however renal function declined, leading to transplant. Since transplant, has been on HCQ, MMF, tacrolimus, and tapered off steroids. She has significant fatigue, and she is pale. Hgb 6.2, and very low retic count. Bone marrow bx shows pure red cell aplasia with giant proerythroblasts. What is going on?
Ans:
Giant erythroblasts = Parvovirus B19 infection!!!
-this is typically transient, HOWEVER, in immunocompromised patients like this, IgM antibodies do NOT develop and are impaired. Viremia can persist and PRCA can be sustained.
-testing for parvo IgG and IgM not reliable in these patients
-TREATMENT: IVIG

Question:
What marker can be used as a prognostic marker in SLE-LN?
Ans:
Anti-C1q,
Care 2022, q51

Question:
How does Bosentan work?
Ans:
BLOCKS vascular SMOOTH MUSCLE cell ENDOTHELIN RECEPTORS
-thus inhibiting vasoconstriction
-aka, it is non-selective endothelin receptor ANTAGONIST

Question:
How does Epoprostenol work?
Ans:
Mimics action of Prostacyclin release from endothelial cells, promoting vasodilation

Question:
How does sildenafil work?
Ans:
Blocks cyclic GMP, which increases NO release to cause vasodilation

Question:
In a patient with SLE rash, ANA positive, and normal C3/C4 during flares...what does this suggest?
Ans:
Coexistent complement deficiency, check C1q
-also, consider checking CH50
-cutaneous lupus is the major feature of lupus associated with C1q deficiency

Question:
In a young female with AxSpa (ankylosing spondylitis), which feature typically means they will respond well to TNFi?
Ans:
Young age
-good responders also in: males, short disease duration, +HLAB27, high ESR/CRP

Question:
A patient with chest pain, acne,and nonmarginal syndesmophytes of lumbar spine has either palmoplantar pustolosis, and/or hidradenitis suppurativa. What would histology of these lesions look like?
Ans:
NEUTROPHILIC (not lymphocytic) pseudoabscesses on biopsy
-this is SAPHO syndrome
-bowel inflammation associated with SAPHO

Question:
What is treatment of lupus hemolytic anemia?
Ans:
Pulse steroids, IVIG (acutely), then RTX

Question:
What is treatment of lupus DAH?
Ans:
CYC (cyclosphosphamide)

Question:
What gene in Black people is associated with high prevalence of ESRD from LN?
Ans:
APOL1 genotype
-mutation from resistance to Trypanosoma rhodesiense (sleeping sickness)

Question:
What hematologic malignancy associated with SLE?
Ans:
Non-Hodgkin's lymphoma (ie. Diffuse Large B cell Lymphoma)
-remember increased risk with CYC (cyclophosphamide) and steroid use

Question:
A patient with SLE has decreased lung volumes. What bodily part is causing this?
Ans:
Diaphragm
-"shrinking lung"

Question:
In patients with SLE, what PFT value will lead you to suspect DAH?
Ans:
Increased DLCO (>100%), due to blood in alveoli

Question:
What is MOA of MMF?
Ans:
inhibits Inosine monophosphate dehydrogenase
-REVERSIBLE inhibitor of rate limiting step
-selective efficacy upon stimulated LYMPHOCYTES
-consider MYFORTIC in patients with GI side effects

Qustion:
Describe the NIH protocol for CYC in LN.
Ans:
0.5 - 1g/m2 every month for 6 months total.
-then quarterly thereafter for at least 2 years

Question:
Describe the Euro Lupus trial
Ans:
Recommends Low dose IV CYC (x6 doses of 500mg every 2 weeks....total 3g). 

Question:
What is diagnostic criteria for Catastrophic APS?
Ans:
Definition: needs ≥3 organs, systems of tissues

-development of manifestations simultaneously or in LESS THAN 1 WEEK
-confirmed histopathology of SMALL VESSEL OCCLUSION in at least 1 organ/tissue
-confirmation of aPL x2 (12 weeks apart)

Question:
What is treatment for Catastrophic APS?
Ans:
Anticoag (usually IV heparin) + HIGH dose steroids
-then IVIG/PLEX
     -then RTX or Eculizumab

Question:
In patients with SLE and +APS labs, but no history of clot, what is the treatment recommendation?
Ans:
ASA 81mg daily

Question:
What is treatment recommendation for a patient with APS (has history of clot with positive APS antibodies) who develops a clot while on warfarin?
Ans:
Target INR 3-4 +/- ASA 81mg daily

Question:
Define Obstetric (pregnancy) APS with treatment.
Ans:
patients with at least 1 fetal lose ≥10 weeks gestation, x3 fetal loss <10 weeks, OR at least 1 premature birth less than 34 weeks, but no VTEs history

***patients must have APS antibodies positive twice, 12 weeks apart (the IgAs do not count, only IgM and IgG)

THEN—-> you use the Sapporo Pregnancy criteria
        -Low dose ASA + Prophylactic heparin (enoxaparin 0.5mg/kg/day SubQ QD)

Question:
What is the main immune MHC pathway for seronegative spondyloarthropathies?
Ans:
MHC Class I via CD8+

Question:
What has the greatest sensitivity for detecting AxSpa on imaging?
Ans:
Bone marrow edema on STIR


Question:
What does subchondral bone resorption at SI joint (with minimal cartilage surface irregularity) mean on imaging?
Ans:
Hyperparathyroidism......hallmark finding
-Care 2016, q38

Question:
What percentage of AxSpa patient have subclinical microscopic gut inflammation?
Ans:
>60%

Question:
What BASDAI score indicates active disease in AxSpa?
Ans:
≥4

Question:
What is the role of PAD4 enzymes in regards to autoimmune diseases?
Ans:
Citrullinates residues on proteins like histones, and vimentin
-this produces ACPAs (anti-CCP)

Question:
What is a very important link between the Innate Immune response and Adaptive immune response in regards to antigen presentation?
Ans:
NETs, very efficiently presents antigens

Question:
In regards to complement system, at what point do the Classical System and Alternative pathway converge?
Ans:
C3

Question:
What type of cell are huge producers of Type I IFN?
Ans:
Plasmacytoid dendritic cells
-especially in SLE

Question:
What do the checkpoint inhibitors that oncologists prescribe do?
Ans:
They BLOCK PD-1 and CTLA-4
-Ipilimumab blocks CTLA-4
-Nivolumab/Pembrolizumab block PD-L1
-these cancer drugs INCREASE AUTOIMMUNITY

Question:
Which biologic medication can cross cell membranes?
Ans:
JAKi

Question:
What is MOA of ustekinumab?
Ans:
Blocks the p40 subunit of IL-12 and IL-23
-therefore, blocks Th1 and Th17
Question:
What is MOA of risankizumab?
Ans:
Blocks p19 subunit of IL-23
-only blocks Th17

Question:
What is MOA of ixekizumab?
Ans:
humanized IgG4 monoclonal antibody that binds (IL-17A) cytokine and inhibits its interaction with the IL-17 receptor

Question:
What is the underlying dysfunction in CAPS?
Ans:
erroneously activated NLRP3 (Gain of Function), for cryopyrin

Question:
What normal, inhibitory function of the innate immune response helps regulate IL-1 and the inflammasome?
Ans:
A20
-disorder of this insufficiency looks like Behcets, Tx: colchicine, TNF, IL-1i

Question:
Does vision loss occur in episcleritis?
Ans:
No

Question:
What part of the ear is spared in RP?
Ans:
Does not effect the soft lobule of the ear
-remember, parasternal joint (ie. chest) is most commonly affect arthritis.
-usually not erosive

***need to suspect VEXAS in male patients with RP***

Question:
In HSP vasculitis, what does the skin biopsy show?
Ans:
Vasculitis of small vessels, primarily POST CAPILLARY VENULES

Question:
In patient with Sarcoid, what does immunoperoxidase staining show?
Ans:
+CD68, consistent with histiocytes

Question:
What is the triad for Blau syndrome?
Ans:
Recurrent UVEITIS
Dermatitis
Symmetric arthritis

-remember, it is Granulomatous
-often seen with Crohn's disease
-early-onset Sarcoidosis!!! (look for in children)

Question:
In sarcoid, what is indicative of good prognosis?
Ans:
Lofgren's erythema nodosum

Question:
Which DMARD should be avoided in sarcoidosis?
Ans:
Etanercept
-causes sarcoidal reaction

Question:
If a patient with sarcoid has pulmonary involvement, which treatment should you consider?
Ans:
Infliximab

Question:
Which viral arthritis causes severe retroorbital pain?
Ans:
Dengue
-also, look for BLEEDING

Question:
Which viral arthritis has synovitis?
Ans:
CHIK
-also Parvo....

Question:
Which viral arthritis is known to have a "relative bradycardia" with respect to fever?
Ans:
Yellow Fever

Question:
What infection is known to be a mimicker of sarcoid given HyperCalcemia and inflammatory arthritis?
Ans:
Poncet's Disease (inflammatory peripheral arthritis from TB)
-test sputum for AFB

Question:
What is the gene for classic type Ehler-Danlos syndrome?
Ans:
COL5A
= hypermobility + loose (atrophic) skin
defect in collagen Type 5

Question:
What is the gene for vascular type Ehler-Danlos syndrome?
Ans:
COL3A1
defect in collagen type 3


Question:
Which is the only GSD that has normal urine myoglobin?
Ans:
Cori Disease
-GSD Type 3, glycogen debranching enzyme

Question:
Patient has long standing renal disease, low alk phos, and no evidence of Hyperparathyroidism. What is this? What is treatment?
Ans:
Adynamic bone disease
-most important form of renal osteodystrophy
-adding more Vit D or Ca is WRONG, because will worsen
-TX: Sevelamer

Question:
What neuro drug can worsen osteoporosis?
Ans:
Phenytoin
-messes with Vit D absorption

Question:
What FRAX score is used to treat osteoporosis?
Ans:
-if hip fracture risk is 3% or greater
    -if major osteoporotic fracture risk is 20% or greater

    adjusted for ≥7.5mg daily prednisone:
            -≥1% for hip fracture
            -≥10% for major osteoporotic fracture

Question:
What is the MOA of bisphosphonates?
Ans:
Inhibits G protein prenylation
- inhibiting ***farnesyl pyrophosphate synthase***, which is important in ***promoting attachment of the osteoclast to the bone***
-avoid if GFR <30-35

Question:
If patient has a atypical femur fracture from bisphophonates, what is management in terms of osteoporosis?
Ans:
D/C any antiresorptive
-consider Teriparatide

Question:
Aside from bisphosphonate use, what are other risk factors for osteonecrosis of jaw?
Ans:
IV bisphosphonate (moreso than oral)
Dental extractions
Dental implants
Poor dentition
Anti-cancer treatment
GCS
Smoking
Diabetes

Question:
What are the rec's for bisphosphonate holiday for oral vs. IV?
Ans:
Oral after ≥5 years
IV after ≥3 years

Question:
Which osteoporosis medication has a benefit with intermittent dosing, causing an anabolic effect on bone?
Ans:
Teriparatide, abaloparatide

Question:
Which osteoporosis med is contraindicated with HYPOcalcemia?
Ans:
Romosozumab
-also, if hx of stroke or MI in last 1 year (like raloxifene)

Question:
What osteoporosis medication would be good for a young female who wants to avoid bisphosphonates, and mainly has vertebral osteoporosis?
Ans:
Raloxifene

Question:
What effect does aspirin have in terms of decreasing/increasing uric acid level?
Ans:
Increases tubular reabsorption of urate, increases it in serum
-greater than 5g daily can cause URICOSURIA
-BUT.....1-2g daily paradoxically causes URATE RETENTION

Question:
Young boy has high fevers and leg pain. Refuses to walk. Initially had cough, myalgias, and high fever. Cough and fever resolved after 5 days, but leg pain worsened. No injuries.
Currently afebrile, ankles are plantar flexed and hurt him when trying to passively dorsiflex BL. TTP in both calves, with no swelling or pain. What is this?
Ans:
Viral myositis (ie. acute childhood myositis)
-self limiting
-most commonly associated with Influenza A or B

Question:
What are some pathognomonic symptoms of Whipple's disease?
Ans:
Vit B12 deficiency
Sensory peripheral neuropathy
Hyperpigmentation
**Oculomasticatory myorhythmia (rhythmic movements of eye, tongue, masseters)**

Question:
What would a biopsy of synovitis thought to be due to silicone show?
Ans:
Granulomatous
-mimics Sarcoid

Question:
Most common eye disease in RA?
Ans:
Episcleritis

Question:
Most severe eye disease in RA?

Ans:
PUK (peripheral ulcerative keratitis), also could be scleromalacia perforans

Question:
Cavitary lesions in lungs. Cough, CP, fever, ataxia, diplopia. Tender nodules in thighs and abdomen. Decreases sensation in BLE. Crackles heard on exam.
Anemic, ESR 100, ANA, and ANCA both negative.
MRI brain shows white matter changes.
CXR with multiple cavitary lesions.
Lung biopsy shows lymphocyte infiltration around small blood vessels without vessel necrosis. No granuloma.
Dx?
Ans:
Pulmonary Lymphoid granulomatosis (PLG)
-difficult to dx clinically. Presents as multiple pulmonary nodules. Prognosis poor, may respond to RTX.
-Triad of polymorphic lymphoid infiltrates, transmural infiltration of arteries and veins by lymphoids cells, and possible areas of necrosis within infiltrates.
-***NO vessel wall necrosis (vs. GPA, so look for this***)
`;

const KEYWORDS_TO_CATEGORY = {
    'lupus': 'SLE', 'SLE': 'SLE', 'HCQ': 'Medications', 'TNFi': 'Medications', 'RTX': 'Medications',
    'osteoporosis': 'Osteoporosis', 'osteoarthritis': 'Osteoarthritis', 'gout': 'Crystal', 'vasculitis': 'Vasculitis',
    'RA': 'RA', 'rheumatoid arthritis': 'RA', 'myositis': 'Myositis', 'ILD': 'ILD',
    'psoriatic': 'PsA', 'ankylosing': 'SpA', 'lyme': 'Lyme', 'infection': 'Infection',
    'genetics': 'Genetics', 'pediatric': 'Pediatrics', 'Toxicity': 'Medications',
    'sarcoid': 'Immunology', 'MACROPHAGE': 'Immunology', 'immunology': 'Immunology',
    'macrophage': 'Immunology', 'macrophage activating syndrome': 'Immunology',
    'syndrome': 'Other', 'disease': 'Other'
};

const determineCategory = (qText, aText) => {
    const combined = (qText + " " + aText).toLowerCase();
    for (const [kw, cat] of Object.entries(KEYWORDS_TO_CATEGORY)) {
        if (combined.includes(kw.toLowerCase())) return cat;
    }
    return 'Other';
};

// Parse into blocks
// use robust splitting, regex looking for 'Question:' or 'Qustion:'
const blocks = rawData.split(/Q[u]?estion:\s*/i).filter(b => b.trim().length > 0);
let formattedRows = [];

for (const block of blocks) {
    const parts = block.split(/Ans:\s*/i);
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
