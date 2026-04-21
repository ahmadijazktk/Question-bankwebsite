import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'updatedquestion.txt');

// Each entry: [question, answer, category]
const newQuestions = [
    [
        `What cells are in synovial fluid vs. biopsy in patient with Rheumatoid arthritis?`,
        `Synovial fluid has <b>NEUTROPHILS</b><br>Synovial biopsy has <b>LYMPHOCYTES</b>`,
        `RA`
    ],
    [
        `What is difference between multiple epiphysial dysplasia and pseudochondroplasia?`,
        `Both have similar genetic mutation. Pseudoachondroplasia tends to show more <b>SEVERE</b> phenotype including <b>VERTEBRAL</b> involvement (rounding of vertebral bodies).`,
        `Genetics`
    ],
    [
        `Physical exam finding of localized tenderness several centimeters distal to the lateral epicondyle + aggravated pain with resisted MIDDLE FINGER extension means what?`,
        `<b>Posterior Interosseous Neuropathy</b><br>-this is not PIN Syndrome......which is more weakness than pain<br>-this is more "progressive" than just PIN syndrome. Because you develop pain later, along with weakness.`,
        `PhysicalExam`
    ],
    [
        `Name risk factors for atypical femur fracture from bisphosphonates`,
        `<b>Asian</b><br><b>Longer than: 3 years for oral, 5 years for IV</b><br><b>Age between 65 and 85</b><br><b>Increased weight</b><br><b>Shorter height</b>`,
        `Osteoporosis`
    ],
    [
        `What causes elevated FGF-23 (fibroblast growth factor 23)?`,
        `can be from:<br>1) osteomalacia 2/2 renal phosphate wasting<br>2) X-linked hypophosphatemic rickets<br>3) acquired Tumor-induced osteomalacia<br>-serum PHOSPHATE will be LOW<br>-remember that FGF-23 decreases reabsorption of phosphate, and decreased production of 1,25-OH Vit D`,
        `MetabolicBone`
    ],
    [
        `A patient with SSc has bloating. What is the treatment and why?`,
        `<b>Rifaximin or macrolide (erythromycin)</b><br>-patient has small intestinal bacterial overgrowth (SIBO)<br>-can cause low Vit D and B12<br>-look for neuropathy symptoms`,
        `SSc`
    ],
    [
        `Aside from checking Hep B antibodies, what else should be checked before starting RTX?`,
        `<b>IgG levels</b><br>-because low levels MUCH MORE predictive of serious infections (moreso than low IgM or IgA)`,
        `Medications`
    ],
    [
        `Which med used to treat breast cancer can cause arthralgias?`,
        `<b>Anastrozole</b>`,
        `Medications`
    ],
    [
        `Describe features of FCAS (Familial Cold Autoinflammatory Syndrome)`,
        `-remember "C" for Cryopyrin...belongs to NLRP3<br>-triggered by <b>Cold</b>, for "C"<br>-low fevers, polyarthralgia<br>-<b>HIVES</b><br>-form of CAPS (Cryopyrin-associated Periodic Syndrome), <b>Autosomal Dominant</b>....GOF in NLRP3`,
        `Autoinflammatory`
    ],
    [
        `-young patient &lt;50, with arthralgias, myalgias, fatigue<br>-features of CPPD, but also with:<br>-LOW K<br>-LOW Mag<br>-LOW urine Calcium<br>-"salt craving"<br>-recurrent attacks of pseudogout`,
        `<b>Gitelman Syndrome</b><br>-most frequently inherited renal tubular disorders<br>-Autosomal Recessive<br>-causes metabolic ALKALOSIS`,
        `Genetics`
    ],
    [
        `Aside from DI-SLE, what other reaction can occur from TNFi?`,
        `<b>Sarcoidosis</b><br>-most patients present with LUNG and SKIN manifestations (hilar adenopathy, pernio)<br>-especially Etanercept`,
        `Medications`
    ],
    [
        `Complement activation through which pathway is important in ANCA associated vasculitis pathogenesis via C5a generation?`,
        `<b>Alternative complement pathway</b><br>-lectin pathway activated by pathogen surface components (MBL)<br>-classic pathway initiated by immune complexes (creates link between adaptive and innate response, starts with C1q)`,
        `Vasculitis`
    ],
    [
        `What gene associated with Stickler syndrome?`,
        `<b>COL2A1</b><br>-early onset OA<br>-Autosomal Dominant<br>-flat mid face, short nose, micrognathia<br>-SUBSTANTIAL risk of retinal detachment`,
        `Genetics`
    ],
    [
        `Most common organism causing septic arthritis in hemophilia?`,
        `<b>Staph aureus and Strep</b>`,
        `Infection`
    ],
    [
        `What positive benefit do TNFi have on cardiovascular disease in patients with ankylosing spondylitis?`,
        `<b>Reduce risk of acute CV events (NOT venous thromboembolism)</b><br>-AxSpa patients at increased risk of accelerated atherosclerosis from inflammation`,
        `SpA`
    ],
    [
        `What is difference between FABER and PACE sign?`,
        `<b>FABER</b> is flexion, abduction, external rotation of hip while <b>SUPINE</b> (sacroiliac disease)<br><br><b>PACE</b> is resisted hip abduction and external rotation while <b>SEATED</b> (piriformis syndrome)<br>-FAIR is also for piriformis syndrome`,
        `PhysicalExam`
    ],
    [
        `What is the most common renal involvement in ankylosing spondylitis?`,
        `<b>Renal amyloidosis</b>`,
        `SpA`
    ],
    [
        `What disease has:<br>-normal 25-OH Vit D<br>-low 1,25-Dihydroxyvitamin D<br>-normal/low Phosphate<br>-elevated Alk phos<br>-elevated PTH<br>-history of fracture, bone pain, family history of OSTEOPOROSIS`,
        `<b>1-alpha Hydroxylase Deficiency</b><br>-labs can look similar to oncogenic (tumor induced) osteomalacia, so make sure to know difference<br>-Oncogenic tumor induced will have elevated FGF23`,
        `MetabolicBone`
    ],
    [
        `Which is the most common glycogen storage disease?`,
        `<b>McArdle disease, GSD Type V (5)</b><br>-second wind phenomenon, elevated CK at baseline`,
        `Genetics`
    ],
    [
        `In EGPA, what feature would be expected with +ANCA antibodies?`,
        `<b>Renal disease and mononeuritis</b><br>-NOT high eosinophils, myocarditis, or alveolar hemorrhage.`,
        `Vasculitis`
    ],
    [
        `High calcium, diffuse non-pitting edema of hands, feet, and legs, with clubbing of fingernails. Xrays of hands show fluffy and spiculated periostitis of multiple phalangeal and carpal bones. Irregular periosteal new bone formation present in distal medial tibias.`,
        `<b>Thyroid Acropachy</b><br>-patient will have hx of Graves/thyroid disease, and signs of myxedema/thyroid dermopathy.`,
        `Endocrine`
    ],
    [
        `In patients with Hyperparathyroidism, what anatomic area expected to show more severe osteoporosis?`,
        `<b>Distal radius</b><br>-BMD of distal radius by DEXA should be done serially.`,
        `MetabolicBone`
    ],
    [
        `What is Darier's sign and what disease does it suggest?`,
        `<b>Hyperpigmented skin lesions that when rubbed cause pruritis</b><br>-highly suggestive of MAST CELLS, think of Systemic Mastocytosis<br>-check tryptase and bone marrow biopsy`,
        `Immunology`
    ],
    [
        `What muscle/tendon does the EMPTY CAN aka Jobe test?`,
        `<b>Supraspinatus</b><br>-most commonly involved tendon in rotator cuff tendinitis<br>-shoulder abduction to 30 degrees`,
        `PhysicalExam`
    ],
    [
        `Can you use azathioprine/cyclosporine in combination with JAKi?`,
        `<b>No</b><br>-also cannot use Probenecid with JAKi`,
        `Medications`
    ],
    [
        `Which features of AxSpa are associated with radiologic progression?`,
        `-male sex<br>-older age<br>-<b>smoking history</b> ***3rd<br>-<b>elevated inflammatory markers</b> ***2nd<br>-<b>syndesmophytes</b> ***1st strongest`,
        `SpA`
    ],
    [
        `What factors place a child with JIA at highest risk for uveitis?`,
        `<b>ANA+</b><br><b>Developing arthritis before age 7</b><br><b>Short disease duration (less than 4 years)</b>. In other words, recent onset of disease is EXTREMELY IMPORTANT to rule out uveitis.<br>-***also, if photo of eye, look for irregular pupil which results from SYNECHIAE formation.....BIG RISK FACTOR for uveitic glaucoma***<br>-CARE 2020 q24!!!!!!!!<br><br>***+RF does NOT increase risk of uveitis in JIA`,
        `Pediatrics`
    ],
    [
        `What factors are associated with higher risk of death in PAN?`,
        `<b>proteinuria &gt;1g daily, renal disease, cardiomyopathy, severe GI disease, and CNS disease</b><br>-presence/absence of hepatitis not shown to indicate worse prognosis`,
        `Vasculitis`
    ],
    [
        `What is the most common EKG finding in a patient with sarcoid?`,
        `<b>3rd degree AV block</b><br>-2nd most common is V. Tach`,
        `Immunology`
    ],
    [
        `What disease has:<br>-LOW Alk phos<br>-Elevated Vit B6<br>-HIGH urine phosphoethanolamine<br>-adults will have osteomalacia, dental abnormalities, multiple fractures, osteoporosis`,
        `<b>Hypophosphatasia (HPP)</b><br>TX: asfotase alpha<br>DX: confirm with genetic testing<br>-inactivating mutation of gene that encodes ALPL (nonspecific alkaline phosphatase)`,
        `MetabolicBone`
    ],
    [
        `A patient with Rheumatoid Arthritis taking Methotrexate and HCQ is doing well, however has lost weight and developed several nonhealing ulcers. No joint swelling/morning stiffness. Lymph node bx showed polymorphic lymphoproliferative disorder. Next step?`,
        `<b>Withdrawal of MTX</b><br>-not use RTX at this time<br>-MTX-associated LPDs is well described (Epstein Barr virus thought to play important role)`,
        `RA`
    ],
    [
        `Is NCV/EMG abnormal in Multiple Sclerosis?`,
        `<b>No, NCV/EMG is typically normal</b>, because lesions are central`,
        `Neurology`
    ],
    [
        `-infants/children with FAILURE TO THRIVE<br>-growth and mental retardation<br>-leads to ESRD with nephrocalcinosis 2/2 hypercalciuria`,
        `<b>Bartter syndrome</b><br>-Autosomal recessive<br>-Metabolic ALKALOSIS<br>-***Mag is normal (vs Gitelman)***<br>-Urine calcium normal or increased (vs. Gitelman which has low urine Ca)`,
        `Genetics`
    ],
    [
        `What test has patient place their arm behind back and push against resistance? What muscle?`,
        `<b>Gerber's test aka Lift-off test</b><br><b>Subscapularis</b><br>-the ONLY muscle for INTERNAL ROTATION (rotator cuff)`,
        `PhysicalExam`
    ],
    [
        `Which Th cell is mainly responsible for EGPA?`,
        `<b>Th2</b><br>-leading to elevated IL-5`,
        `Vasculitis`
    ],
    [
        `What physical exam finding indicates history of JIA vs. RA in a seronegative patient?`,
        `<b>Micrognathia</b><br>-sign of long standing TMJ arthritis during childhood`,
        `Pediatrics`
    ],
    [
        `Rheumatoid arthritis patient on TNFi develops unsteady gait/ataxia. Later, dysarthric speech, horizontal nystagmus, appendicular dystaxia, hyperreflexia, with progression to areflexic quadraplegia.<br>MRI with "white matter changes, possibly normal for age".<br>CSF for viral, bacteria, fungal all negative. He improved with IV steroids...`,
        `<b>Guillain-Barre syndrome VARIANT</b><br>-TNFi can cause demyelination in CNS and PNS<br>-most common GBS variant is Acute Inflammatory Demyelinating Polyradiculopathy (AIDP)<br><br>***CARE 2016, q46<br><br>***Contrast to CARE 2016 q22.<br>I would look at both of these CARE questions and their explanations to differentiate the types of rare neurological side effects from TNFi.`,
        `Medications`
    ],
    [
        `Patient with very destructive foot/ankle arthritis that is painful. Neuro exam normal. She does not have diabetes. What is dx?`,
        `<b>Pseudo-neuroarthropathy of CPPD</b><br>-most important finding on physical exam is NORMAL neuro exam.<br>-***Diabetic neuroarthropathy/Charcot's joint is painless`,
        `Crystal`
    ],
    [
        `What is SONK? Describe the presentation.`,
        `<b>Spontaneous osteonecrosis of the knee</b><br>-medial knee pain, TTP over medial femoral condyle<br>TX: depends on size of lesion<br>-if less than 3.5cm, usually regress<br>-if more than 3.5cm, surgery`,
        `Osteoporosis`
    ],
    [
        `In Complex Regional Pain Syndrome, what treatment may assist with prevention after surgery?`,
        `<b>Vitamin C 500mg QD for 50 days post-op</b>`,
        `PhysicalExam`
    ],
    [
        `In a patient with SLE, which antibody is associated with development of erosive arthritis?`,
        `<b>Anti-CarP</b><br>-not RF<br>-not dsDNA`,
        `SLE`
    ],
    [
        `In studies, is Upadacitinib + MTX superior to Humira + MTX?`,
        `<b>Yes, SUPERIOR and NON-INFERIOR</b>`,
        `Medications`
    ],
    [
        `What is treatment for borrelial lymphocytoma?`,
        `Oral abx 14 days<br><br>WEAK Rec'd, low quality evidence`,
        `Lyme`
    ],
    [
        `What is the most common type of panniculitis?`,
        `<b>Erythema nodosum</b><br>-inflammatory infiltrate of fibrous septa between fat lobules (ie. septal panniculitis)`,
        `panniculitis`
    ],
    [
        `What feature of C-ANCA vasculitis is most associated with relapse?`,
        `<b>PR3 positivity</b>`,
        `Vasculitis`
    ],
    [
        `What is Poncet's disease?`,
        `<b>Inflammatory peripheral arthritis in active TB.</b>`,
        `Infection`
    ],
    [
        `What would muscle biopsy of suspected McArdle disease show?`,
        `<b>Absence of myophosphorylase</b>`,
        `Genetics`
    ],
    [
        `What unique hematologic condition can occur in severe RA (and solid tumors, and SLE)?<br>-not Felty's`,
        `<b>Acquired Factor 8 INHIBITOR</b><br>-classic presentation is ***deep soft tissue bleeding*** in response to a challenge such as SURGERY, or an INVASIVE PROCEDURE (including IM injection)<br>-prolonged PTT, normal PT`,
        `RA`
    ],
    [
        `What is the most common cause of erythema nodosum in children?`,
        `<b>Streptococcal infection</b>`,
        `Pediatrics`
    ],
    [
        `What are the amplitude, duration, and recruitment in patients with myositis?`,
        `<b>Small amplitude</b><br><b>Short duration</b><br><b>Early recruitment</b>`,
        `Myositis`
    ],
    [
        `What skin disorder can be associated with APS?`,
        `<b>Anetoderma</b><br>-can be the presenting sign in some patients<br>-also, livedo reticularis`,
        `SLE`
    ],
    [
        `What drugs are known to cause ANCA vasculitis?`,
        `<b>Hydralazine, PTU, methimazole</b><br>-also mirabegron-sofosbuvir, nintedanib***(in 2022)`,
        `Vasculitis`
    ],
    [
        `Can SLE cause hearing loss?`,
        `<b>Yes</b><br>-suspect autoimmune hearing loss from SLE in BL sensorineural hearing loss.<br><br>-of note, Cogan's syndrome will have interstitial keratitis + hearing loss.****`,
        `SLE`
    ],
    [
        `A female patient with rash that develops after prolonged walking/standing/hiking/long plane flights. Some eye dryness. No ulcers, Raynauds, joint pains, fevers, etc. Skin biopsy shows LCV. Negative hepatitis serologies, +RF. What is next test to check?`,
        `<b>Immunoglobulins</b><br><br>-this is Benign Hypergammaglobulinemic purpura of Waldenstrom (BHPW)<br>-elevated IgG<br>-associated with Sjogrens and +RF is universal<br>-***Cryos not always presents, as this is not Cryoglobulinemic vasculitis. But rather immune complex deposition in DERMAL VESSELS due to HYDROSTATIC PRESSURE (prolonged standing)<br>-No TXs, so can keep occurring.<br><br>CARE 2014, q20`,
        `Immunology`
    ],
    [
        `What cumulative dose of cyclophosphamide is associated with premature ovarian failure (POF)?`,
        `<b>5.9g or more</b>`,
        `Medications`
    ],
    [
        `In patients with CVID, what bacterial joint infection is most likely (what organisms)?`,
        `-<b>Ureaplasma, Mycoplasma, Staph, Strep, Haemophilus</b><br>-in sexually active, think N. gonorrhea<br>-also consider this in PREGNANT PATIENTS, because they are also immunocompromised`,
        `Infection`
    ],
    [
        `Describe HIDs`,
        `-<b>Hyper IgD syndrome</b><br>-form of HEREDITARY periodic fever syndrome<br>-Autosomal Recessive<br>-will occur in BABIES....in FRANCE, NETHERLANDS<br>-triggered by VACCINES***<br><br>-obviously elevated IgD<br>-lasts 3-7 days***<br>-TX: NSAIDs, Anakinra/Canakinumab`,
        `Autoinflammatory`
    ],
    [
        `How long does Methotrexate take to take effect?`,
        `<b>4 weeks</b>, because of POLYGLUTAMATION`,
        `Medications`
    ],
    [
        `What rare lung finding can be in the initial presentation of MPA?`,
        `<b>Interstitial (pulmonary) fibrosis</b><br>-most common pattern is UIP`,
        `Vasculitis`
    ],
    [
        `What infection that causes cryoglobulinemic vasculitis can occur with people in contact with farm animals?`,
        `<b>Coxiella burnetii (Q fever)</b><br>-can also cause Mixed Cryoglobulinemia syndrome (Type 2)....+RF, LCV, low C4, etc.<br>-think of this in a patient with flu like sx, hepatitis, infective endocarditis, - BCx, and MCS, ANA - , and HCV -.<br>-Care 2021, q50`,
        `Infection`
    ],
    [
        `In a child with history of HSP, what is the most important aspect for long-term follow up?`,
        `<b>Serial UA and BP screening</b><br>-HSP related nephritis could occur.<br>-no need for GI referral unless intussusception sx persist`,
        `Pediatrics`
    ],
    [
        `How to determine anemia of inflammation and chronic disease (AICD)?`,
        `Mediated by <b>hepcidin</b><br>-Hepcidin inhibits DIET iron absorption in duodenum<br>-decreased iron recycling via downregulation of iron exporter ferroportin<br>-increased internalization of ferroportin, preventing release of iron stores<br>-bone marrow iron adequate<br>-ferritin elevated`,
        `Immunology`
    ],
    [
        `Which osteoporosis med may play a role in reducing bone erosions in Rheumatoid arthritis?`,
        `<b>Denosumab</b>`,
        `RA`
    ]
];

// Read existing file
const existing = fs.readFileSync(filePath, 'utf8');
// Remove trailing newline/empty lines
const trimmed = existing.trimEnd();

// Build new lines
const newLines = newQuestions.map(([q, a, cat]) => `${q}\t${a}\t${cat}`);

// Write back: existing content + newlines
const finalContent = trimmed + '\n' + newLines.join('\n') + '\n';
fs.writeFileSync(filePath, finalContent, { encoding: 'utf8' });

console.log(`✅ Done! Added ${newQuestions.length} new questions.`);
console.log(`Total lines written: ${finalContent.split('\n').length}`);
