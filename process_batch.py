import re
import os

text = r"""
Question:
A patient with any LN class with an inadequate renal response (i.e., have not achieved at least a partial renal response by 6-12 months) we CONDITIONALLY recommend escalation of treatment:
• For initial DUAL therapy, escalate to TRIPLE therapy.
• For initial TRIPLE therapy, change to an alternative TRIPLE therapy or consider addition of an antiCD20 agent as a second immunosuppressive.

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
Tags:
ACR
CNI
LN
Medication
MMF
Rituximab
SLE


Question:
In regards to lupus nephritis with development of end-stage kidney disease, what are the recommendations for the timing of dialysis? 
Ans:
STRONGLY recommend kidney transplantation over dialysis

"In people with LN and ESKD, we STRONGLY recommend kidney transplantation over dialysis."

"In people with LN who have progressive loss of kidney function and are nearing ESKD (eGFR of 15 ml/min/1.73m2 ), we CONDITIONALLY recommend preemptive kidney transplant over dialysis or non-preemptive transplant."
Tags:
ACR
CNI
LN
Medication
MMF
Rituximab
SLE


Question:
A patient with SLE and Class IV lupus nephritis establishes in your clinic. She has undergone multiple treatment regimens with HCQ, MMF, belimumab, CNIs, RTX, and induction/tapering steroids. She continues to have significant proteinuria and reduced kidney function. 
What is next best step in management?  
Ans:
"Consider adherence and/or other diagnoses (ie. aPL nephropathy)....OR advanced chronicity."
Tags:
ACR
CNI
LN
Medication
MMF
Rituximab
SLE



Question:
A patient has SLE and past Class IV and Class V lupus nephritis. He has already had a kidney transplantation and follows with his nephrologist. 
He is currently on HCQ. In terms of extra-renal symptoms, he has been "doing just fine" with no complaints. 
He asks if he still needs to follow up with you because he has been stable just on HCQ and his nephrologist is "managing his kidneys."
What do you tell him?
Ans:
Recommend regular follow up with rheumatologist...STRONG rec'd

"In people with LN on current dialysis or after kidney transplantation, we STRONGLY recommend regular follow up with rheumatology."
Tags:
ACR
CNI
LN
Medication
MMF
Rituximab
SLE


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
Tags:
ACR
Medication
SLE


Question:
A 25 year old female with known SLE has been doing well on HCQ 200mg daily which is appropriate for her weight. She has a follow up with you today and as always says she is doing well with no complaints. She previously had joint pain and rashes that were uncontrolled however since taking HCQ you tell her she has been in remission. She has been taking HCQ for 5 years and wants to know if she should continue taking it. Her routine lab work today is normal. What do you tell her? 
Ans:
Continue taking HCQ. 

According to ACR
In people with SLE:
…We conditionally recommend continuing HCQ therapy indefinitely, even in the setting of sustained remission.

CONDITIONAL REC'D
Tags:
ACR
Medication
SLE


Question:
A 30 year old female with SLE (+anti-Smith, +ANA) has been in remission on HCQ weight based, and 5mg daily prednisone. Her symptoms are well controlled and she no longer has inflammatory joint pain or rashes. She wants to stay on her current regimen. What is your next best step? 
Ans:
Recommend a slow taper toward zero while staying on HCQ. 

According to ACR:
"In people with SLE with sustained remission on prednisone ≤5 mg/day, we conditionally recommend a slow taper toward zero."
Tags:
ACR
Medication
SLE


Question:
A 30 year old female with SLE (+anti-Smith, +ANA) has been in remission on HCQ weight based, and 5mg daily prednisone. Her symptoms are welll controlled and she no longer has inflammatory joint pain or rashes. You advised to taper off prednisone however her inflammatory joint pain will flare when she tries to reduce prednisone below 5mg daily. What is your next step? 
Ans:
According to ACR:

"In people with SLE who are unable to taper prednisone to  ≤5 mg/day, we conditionally recommend intiating or escalating immunosuppressive therapy."

Under Musculoskeletal Arthritis in the 2025 ACR SLE Treatment Guideline:
"For persistent or recurrent active SLE arthritis on HCQ, regardless of prior/current NSAIDs or short-term glucocorticoid therapy: …We conditionally recommend initial therapy with MTX, MPAA, or AZA, with a low threshold to add or substitute with belimumab or anifrolumab for inadequate response over initial biologic therapy."
Tags:
ACR
arthritis
Medication
SLE


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
Tags:
ACR
Medication
SLE


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
Tags:
ACR
Medication
SLE


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
Tags:
ACR
Medication
SLE


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
Tags:
ACR
Medication
SLE


Question:
What is the treatment choice for a patient with SLE and active lupus optic neuritis OR lupus acute confusional state OR acute lupus mononeuritis multiplex?
Ans:
Pulse/high-dose steroids plus IV CYC, MPAA (ie. MMF), or RTX

According to ACR
"Severe neuropsychiatric syndromes: For Active lupus optic neuritis -OR- Lupus acute confusional state -OR- Active lupus mononeuritis multiplex: …We conditionally recommend initial therapy with pulse/high-dose glucocorticoid taper plus immunosuppressive therapy with IV CYC, MPAA, or anti-CD20 therapy over pulse/high-dose glucocorticoid monotherapy alone."
Tags:
ACR
Medication
SLE


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
Tags:
ACR
cyclophosphamide
Medication
Rituximab
SLE


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
Tags:
ACR
cyclophosphamide
Medication
Rituximab
SLE


Question:
A patient with SLE has new onset seizures. She is on HCQ alone. How do you optimize her SLE treatment? 
Ans:
According to ACR
"Seizure: For seizures attributed to active SLE: …We conditionally recommend anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone."

Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX. 
Tags:
ACR
azathioprine
cyclophosphamide
Medication
MMF
Rituximab
SLE


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
Tags:
ACR
Medication
skin
SLE


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
Tags:
ACR
Medication
SLE


Question:
A 35 year old woman with 5 year history of SLE (on HCQ) presents with 2 weeks of new, non-blanching, palpable purpura and painful ulcers on her lower extremities. Also has had arthralgias. 
Exam shows multiple purpuric papules and several shallow ulcers with violaceous borders on the shins. Labs show elevated ESR, low C3/C4, elevated dsDNA and positive SSA. UA is unremarkable. 
What do you do? 
Ans:
Pulse/high-dose steroid taper + conventional or biologic immunosuppressive therapy (preferred IV CYC or RTX over other options)

According to ACR
For vasculitis attributed to active SLE: …We conditionally recommend initial therapy with pulse/high-dose glucocorticoid taper and conventional (IV CYC, MPAA, AZA) or biologic (anti-CD 20 therapy, belimumab, anifrolumab) immunosuppressive therapy over glucocorticoid monotherapy alone;

…We conditionally recommend IV CYC or anti-CD20 therapy as initial therapy over other immunosuppressive therapies.
Tags:
ACR
cyclophosphamide
Medication
Rituximab
SLE
vasculitis


Question:
Myocarditis: For lupus myocarditis that is acute and/or worsening: …We conditionally recommend treatment with glucocorticoid AND IV CYC, MPAA, anti-CD20 therapy and/or IVIG over glucocorticoid monotherapy.

Make note that according to ACR, MTX is not listed as a steroid sparing option.  
Ans:
Myocarditis: For lupus myocarditis that is acute and/or worsening: …We conditionally recommend treatment with glucocorticoid AND IV CYC, MPAA, anti-CD20 therapy and/or IVIG over glucocorticoid monotherapy.
Tags:
ACR
cyclophosphamide
Medication
MMF
Rituximab
SLE
vasculitis
"""

def process_batch(content, mode='w'):
    content = content.replace('Ans:\n', 'Ans:\n')
    questions = re.split(r'\nQuestion:\s*', content)
    
    if content.strip().startswith('Question:'):
        if questions[0].strip() == '':
            questions = questions[1:]

    output_lines = []
    if mode == 'w':
        output_lines = ['#separator:tab', '#html:true', '#tags column:12']
        
    count = 0
    for q_block in questions:
        if not q_block.strip(): continue
        
        parts = re.split(r'\nAns:\s*', q_block, flags=re.IGNORECASE)
        if len(parts) < 2: continue
        
        q_content = parts[0].strip()
        rest = parts[1]
        
        tag_match = re.search(r'\nTags?:\s*(.*)', rest, re.IGNORECASE | re.DOTALL)
        if tag_match:
            ans_content = rest[:tag_match.start()].strip()
            tags_content = tag_match.group(1).strip()
        else:
            ans_content = rest.strip()
            tags_content = ''
            
        q_content = re.sub(r'{{c\d+::(.*?)\}\}', r'{{\1}}', q_content)
        ans_content = re.sub(r'{{c\d+::(.*?)\}\}', r'{{\1}}', ans_content)
        
        recs = ["conditionally recommend", "CONDITIONALLY REC'D", "WEAK Rec'd", "STRONG REC'D", "STRONGLY REC'D", "Strong Recommendation", "STRONGLY rec'd", "conditionally rec'd"]
        for r in recs:
            ans_content = re.sub(re.escape(r), f'<b>{r.upper()}</b>', ans_content, flags=re.IGNORECASE)

        q_content = q_content.replace('\n', '<br>')
        ans_content = ans_content.replace('\n', '<br>')
        
        tags_raw = re.split(r'[,\n\s]+', tags_content)
        tags_formatted = ' '.join([t.strip() for t in tags_raw if t.strip()])
        
        line = f'{q_content}\t{ans_content}\t{tags_formatted}'
        output_lines.append(line)
        count += 1

    file_path = 'c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\study-bloom-15-main\\study-bloom-15-main\\updatedquestion.txt'
    
    if mode == 'w':
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output_lines) + '\n')
    else:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write('\n')
            f.write('\n'.join(output_lines) + '\n')
            
    print(f'Done. {count} questions processed in mode {mode}.')

if __name__ == "__main__":
    process_batch(text, mode='a')
