const $ = (id) => document.getElementById(id);
const state = { page: "home", authMode: "login", credits: Number(localStorage.getItem("feliceCredits") || 100) };
const tools = {
 caption:["Caption generator","Write scroll-stopping social captions in English or Hinglish.","✎","Describe your post, product or video"],
 video:["Prompt to video","Describe a scene and prepare a video-generation prompt.","▶","Describe the video you imagine... English ya Hinglish dono chalega"],
 image:["Text to image","Turn a written idea into a detailed image prompt.","▧","Describe the image you want to create"],
 imagevideo:["Image to video","Plan motion for an image you already have.","▣","Describe the movement you want"],
 voice:["AI voice","Prepare a voiceover script and speaking direction.","♫","Paste or describe your voiceover text"],
 script:["Script writer","Build a hook, story and call-to-action for your video.","✍","What is your video about?"],
 subtitles:["Subtitle generator","Prepare readable subtitles from your narration.","▤","Paste your narration or transcript"],
 projects:["My projects","Your saved project ideas will appear here.","▧","Search or describe a project"]
};
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function updateCredits(){ $("creditCount").textContent=state.credits; localStorage.setItem("feliceCredits",state.credits); }
function replayEntrance(element){
 if(!element)return;
 element.classList.remove("view-enter");
 void element.offsetWidth;
 element.classList.add("view-enter");
}
function navigate(page){
 state.page=page; $("homeView").classList.toggle("hidden",page!=="home"); $("toolView").classList.toggle("hidden",page==="home");
 replayEntrance(page==="home"?$("homeView"):$("toolView"));
 document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("mainNav").classList.remove("open");
 if(page!=="home"){const t=tools[page]||tools.caption;$("toolTitle").textContent=t[0];$("toolDescription").textContent=t[1];$("toolBigIcon").textContent=t[2];$("promptInput").placeholder=t[3];$("promptInput").value="";$("resultBox").classList.add("hidden");$("generateButton").textContent=page==="projects"?"Open projects":"Generate ✦";$("generateButton").disabled=page==="projects";$("toolView").scrollIntoView({behavior:"smooth",block:"start"});}
 else window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b){e.preventDefault();navigate(b.dataset.page)}});
$("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("creditsButton").addEventListener("click",()=>toast("Demo balance: "+state.credits+" credits"));
$("accountButton").addEventListener("click",()=>{$("modalBackdrop").classList.remove("hidden")});
$("closeModal").addEventListener("click",()=>$("modalBackdrop").classList.add("hidden"));
$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))$("modalBackdrop").classList.add("hidden")});
document.querySelectorAll("[data-auth]").forEach(b=>b.addEventListener("click",()=>{state.authMode=b.dataset.auth;document.querySelectorAll("[data-auth]").forEach(x=>x.classList.toggle("active",x===b));$("modalTitle").textContent=state.authMode==="login"?"Welcome back":"Create your account";$("authSubmit").textContent=state.authMode==="login"?"Log in":"Create account";$("authNote").textContent="Demo interface only. Connect a secure backend before accepting real accounts."}));
$("authForm").addEventListener("submit",e=>{e.preventDefault();if(!$("privacyCheck").checked){toast("Please accept the Privacy Policy and Terms.");return}toast("This is a frontend demo. Account services need a secure backend.");});
function detectLanguage(s){return /[अ-ह]/.test(s)?"Hindi":/\b(hai|hain|kya|kaise|mera|meri|ke|liye|aur|banao|chahiye|karna|karo|mein|mujhe|tum|bahut|acha|accha)\b/i.test(s)?"Hinglish":"English"}
function generateDemo(){
 const prompt=$("promptInput").value.trim();if(!prompt){toast("Pehle apna prompt likho.");$("promptInput").focus();return}
 if(state.credits<2){toast("Demo credits khatam. Real credits backend se manage honge.");return}
 state.credits-=2;updateCredits();
 const lang=$("languageSelect").value==="auto"?detectLanguage(prompt):$("languageSelect").value;
 const style=$("styleSelect").value;const page=state.page;
 let output="";
 if(page==="caption") output=lang==="English"?`✨ ${prompt}\n\nBig ideas deserve to be seen. Make every moment count.\n\n#Creator #Inspiration #ContentCreation`:`✨ ${prompt}\n\nChhoti si idea, bada impact! 🔥\nApne moments ko duniya ke saath share karo.\n\n#Creator #Inspiration #Reels`;
 else if(page==="video"||page==="imagevideo") output=`VIDEO CONCEPT\n${prompt}\n\nVisual style: ${style}\nAspect ratio: ${$("ratioSelect").value}\nDuration: ${$("durationSelect").value}\nLanguage: ${lang}\n\nSHOT PLAN\n1. Opening: Establish the subject and setting.\n2. Main action: Show the key movement clearly.\n3. Detail: Add a close-up or cinematic detail.\n4. Ending: Finish with a memorable final frame.\n\nNote: This is a prepared concept, not a rendered video. Connect a video-generation model to create the actual video.`;
 else if(page==="image") output=`IMAGE PROMPT\n${prompt}\n\nStyle: ${style}\nAspect ratio: ${$("ratioSelect").value}\nLanguage: ${lang}\n\nAdd details for lighting, camera angle, composition, textures and background. This is a prompt draft, not a generated image.`;
 else if(page==="voice") output=`VOICEOVER SCRIPT\n${prompt}\n\nVoice direction: Clear, natural ${lang} delivery.\nPacing: Medium, with short pauses after important phrases.\nEmotion: ${style}.\n\nNote: Audio generation requires a connected text-to-speech service.`;
 else if(page==="script") output=`HOOK\nKya aapne kabhi socha hai: ${prompt}?\n\nSTORY\nStart with a surprising fact. Explain the main idea in simple steps. Add one memorable example.\n\nENDING\nAapko ye information kaisi lagi? Follow for more!\n\nStyle: ${style} | Language: ${lang}`;
 else if(page==="subtitles") output=prompt.split(/(?<=[.!?।])\s+/).map((line,i)=>`${String(i+1).padStart(2,"0")}  ${line}`).join("\n\n");
 else output="Your project workspace is ready. Saved projects will be available after account and database setup.";
 $("resultText").textContent=output;$("resultDisclaimer").textContent="Prototype mode: this output is generated locally from simple templates. Real AI generation, cloud saving and user accounts are not connected yet.";$("resultBox").classList.remove("hidden");$("resultBox").scrollIntoView({behavior:"smooth",block:"nearest"});toast("Demo result ready · 2 credits used");
}
$("generateButton").addEventListener("click",generateDemo);
$("copyResult").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("resultText").textContent);toast("Copied to clipboard")}catch(e){toast("Copy not available in this browser")}});
function cookieChoice(choice){localStorage.setItem("feliceCookieChoice",choice);$("cookieBanner").classList.add("hidden");toast("Cookie preference saved")}
if(!localStorage.getItem("feliceCookieChoice"))$("cookieBanner").classList.remove("hidden");else $("cookieBanner").classList.add("hidden");
$("acceptCookies").addEventListener("click",()=>cookieChoice("all"));
$("rejectCookies").addEventListener("click",()=>cookieChoice("essential-only"));
$("cookieSettings").addEventListener("click",()=>{const current=localStorage.getItem("feliceCookieChoice");cookieChoice(current==="all"?"essential-only":"all")});
$("cookieDetails").addEventListener("click",e=>{e.preventDefault();toast("Cookie policy: essential storage only in this prototype.")});
$("privacyLink").addEventListener("click",()=>toast("Privacy policy page will be added before public launch."));
$("termsLink").addEventListener("click",e=>{e.preventDefault();toast("Terms page will be added before public launch.")});
$("privacyPolicyLink").addEventListener("click",e=>{e.preventDefault();toast("Privacy policy page will be added before public launch.")});
updateCredits();navigate("home");
