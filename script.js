// Mobile detection and optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPowerMode = navigator.connection && navigator.connection.saveData;

// SINGLE DOM CONTENT LOADED EVENT
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile) {
        initializeWebsiteMobile();
    } else {
        initializeWebsite();
    }
});

// Mobile-optimized initialization
function initializeWebsiteMobile() {
    initNavigation();
    initActiveNav();

    setTimeout(() => {
        initScrollEffects();
        initForms();
    }, 100);
    
    setTimeout(() => {
        initGallery();
        initScrollAnimations();
    }, 300);
    
    setTimeout(() => {
        if (!isLowPowerMode) {
            initVideoPlayerMobile();
        }
        initThemeToggle();
        initSoundToggle();
        initBackToTop();
        initLoadingOverlay();
    }, 500);
    
    setTimeout(() => {
        document.body.classList.add('loaded');
        triggerInitialAnimations();
    }, 200);
}

// Desktop initialization (your original)
function initializeWebsite(){
    initNavigation();
    initActiveNav();
    initScrollEffects();
    initGallery();
    initForms();
    initVideoPlayer();
    initScrollAnimations();
    initThemeToggle();
    initSoundToggle();
    initBackToTop();
    initLoadingOverlay();
    setTimeout(()=>{
        document.body.classList.add('loaded');
        triggerInitialAnimations();
    },100);
}

// Mobile-specific video player
function initVideoPlayerMobile() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.controls = false;
    
    const playOnFirstInteraction = async () => {
        try {
            video.muted = true;
            await video.play();
        } catch (error) {
            console.log('Mobile video autoplay prevented:', error);
        }
        document.removeEventListener('touchstart', playOnFirstInteraction);
        document.removeEventListener('click', playOnFirstInteraction);
    };
    
    document.addEventListener('touchstart', playOnFirstInteraction, { once: true, passive: true });
    document.addEventListener('click', playOnFirstInteraction, { once: true });
}

// REST OF YOUR FUNCTIONS (unchanged)
function initNavigation(){const navbar=document.querySelector('.navbar');const hamburger=document.querySelector('.hamburger');const navMenu=document.querySelector('.nav-menu');const navCenter=document.querySelector('.nav-center');const navLinks=document.querySelectorAll('.nav-menu a');hamburger?.addEventListener('click',()=>{const expanded=hamburger.classList.toggle('active');navMenu.classList.toggle('active');navCenter?.classList.toggle('active');hamburger.setAttribute('aria-expanded',String(expanded))});navLinks.forEach(link=>{link.addEventListener('click',(e)=>{hamburger?.classList.remove('active');navMenu?.classList.remove('active');navCenter?.classList.remove('active');e.preventDefault();const targetSection=document.querySelector(link.getAttribute('href'));if(targetSection){const navHeight=navbar.offsetHeight;window.scrollTo({top:targetSection.offsetTop-navHeight,behavior:'smooth'})}})});let scrollTimeout;window.addEventListener('scroll',()=>{if(scrollTimeout)return;scrollTimeout=setTimeout(()=>{navbar.classList.toggle('scrolled',window.scrollY>100);scrollTimeout=null},10)},{passive:!0})}

function scrollToQuote(){const contactSection=document.querySelector('#contact');const navbar=document.querySelector('.navbar');const navHeight=navbar.offsetHeight;const targetPosition=contactSection.offsetTop-navHeight;window.scrollTo({top:targetPosition,behavior:'smooth'})}

function initScrollAnimations(){const observerOptions={threshold:0.1,rootMargin:'0px 0px -50px 0px'};const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting&&!entry.target.classList.contains('animated')){entry.target.classList.add('animated');if(entry.target.classList.contains('service-card')||entry.target.classList.contains('review-card')){const siblings=Array.from(entry.target.parentNode.children);const index=siblings.indexOf(entry.target);setTimeout(()=>{entry.target.classList.add('slide-up')},index*150)}else if(entry.target.classList.contains('before-after-item')){const siblings=Array.from(entry.target.parentNode.children);const index=siblings.indexOf(entry.target);setTimeout(()=>{entry.target.classList.add('slide-up')},index*100)}else if(entry.target.classList.contains('section-title')){entry.target.classList.add('fade-in')}else if(entry.target.classList.contains('about-text')||entry.target.classList.contains('contact-info')){entry.target.classList.add('slide-left')}else if(entry.target.classList.contains('about-image')||entry.target.classList.contains('quote-form')){entry.target.classList.add('slide-right')}else if(entry.target.classList.contains('leave-review')){entry.target.classList.add('scale-in')}}})},observerOptions);const elementsToAnimate=document.querySelectorAll('.service-card, .review-card, .before-after-item, .about-text, '+'.about-image, .contact-info, .quote-form, .section-title, .leave-review');elementsToAnimate.forEach((el)=>{observer.observe(el)})}

function initGallery(){const track=document.getElementById('galleryTrack');const items=document.querySelectorAll('.before-after-item');const prevBtn=document.getElementById('prevBtn');const nextBtn=document.getElementById('nextBtn');const dotsContainer=document.getElementById('carouselDots');if(!track||!items.length)return;let currentIndex=0;let itemsPerView=window.innerWidth>768?3:1;let maxIndex=window.innerWidth>768?Math.max(0,items.length-itemsPerView):items.length-1;const imageObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){const images=entry.target.querySelectorAll('img[data-src]');images.forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src')});imageObserver.unobserve(entry.target)}})});items.forEach(item=>imageObserver.observe(item));for(let i=0;i<items.length;i++){const dot=document.createElement('button');dot.className='carousel-dot';if(i===0)dot.classList.add('active');dot.addEventListener('click',()=>goToSlide(i));dotsContainer.appendChild(dot)}
function updateCarousel(){if(window.innerWidth>768){const gap=parseFloat(getComputedStyle(track).gap)||32;const itemWidth=items[0].offsetWidth+gap;track.style.transform=`translateX(-${currentIndex*itemWidth}px)`}else{track.style.transform=`translateX(-${currentIndex*100}%)`}
document.querySelectorAll('.carousel-dot').forEach((dot,index)=>{dot.classList.toggle('active',index===currentIndex)});prevBtn.disabled=currentIndex===0;nextBtn.disabled=currentIndex===maxIndex}
function goToSlide(index){currentIndex=Math.max(0,Math.min(index,maxIndex));updateCarousel()}
prevBtn.addEventListener('click',()=>{if(currentIndex>0){currentIndex--;updateCarousel()}});nextBtn.addEventListener('click',()=>{if(currentIndex<maxIndex){currentIndex++;updateCarousel()}});items.forEach(item=>{item.addEventListener('click',()=>{item.classList.toggle('showing-after');const overlay=item.querySelector('.overlay');if(item.classList.contains('showing-after')){overlay.textContent='Click to see before'}else{overlay.textContent='Click to see after'}})});let resizeTimeout;window.addEventListener('resize',()=>{if(resizeTimeout)clearTimeout(resizeTimeout);resizeTimeout=setTimeout(()=>{const newItemsPerView=window.innerWidth>768?3:1;if(newItemsPerView!==itemsPerView){itemsPerView=newItemsPerView;maxIndex=newItemsPerView>1?Math.max(0,items.length-newItemsPerView):items.length-1;currentIndex=0;updateCarousel()}},250)})}

function initForms(){initQuoteForm();initReviewForm()}

function initQuoteForm(){
    const quoteForm=document.getElementById('quoteForm');
    if(!quoteForm)return;
    
    quoteForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const formData=new FormData(quoteForm);
        const submitButton=quoteForm.querySelector('button[type="submit"]');
        const originalText=submitButton.textContent;
        
        submitButton.textContent='Sending...';
        submitButton.disabled=!0;
        
        const templateParams={
            name:formData.get('name'),
            email:formData.get('email'),
            phone:formData.get('phone'),
            address:formData.get('address'),
            projectType:formData.get('projectType'),
            message:formData.get('message')
        };
        
        try{
            const response=await emailjs.send(
                'service_562c71o',
                'template_jxog6i3',
                templateParams
            );
            
            console.log('EmailJS Success:',response.status,response.text);
            showNotification('Quote request sent successfully! We\'ll get back to you soon.','success');
            quoteForm.reset();
        }catch(error){
            console.error('EmailJS Error:',error);
            
            try{
                const emailContent=`
New Quote Request from ${templateParams.name}

Contact Information:
- Name: ${templateParams.name}
- Email: ${templateParams.email}
- Phone: ${templateParams.phone}
- Address: ${templateParams.address}
- Project Type: ${templateParams.projectType}

Project Details:
${templateParams.message}

Please respond promptly to this potential customer.
                `.trim();
                
                const subject=encodeURIComponent('New Quote Request - Groves Real Estate Painting');
                const body=encodeURIComponent(emailContent);
                const mailtoLink=`mailto:Grovesrealestate@gmail.com?subject=${subject}&body=${body}`;
                window.location.href=mailtoLink;
                showNotification('Opening your email client to send the quote request.','info');
            }catch(fallbackError){
                console.error('Fallback error:',fallbackError);
                showNotification('Failed to send quote request. Please try again or call us directly.','error');
            }
        }finally{
            submitButton.textContent=originalText;
            submitButton.disabled=!1;
        }
    });
}

function initReviewForm(){
    const reviewForm=document.querySelector('.review-form');
    if(!reviewForm)return;
    
    reviewForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const formInputs=reviewForm.querySelectorAll('input, select, textarea');
        const name=formInputs[0].value;
        const rating=formInputs[1].value;
        const review=formInputs[2].value;
        
        const submitButton=reviewForm.querySelector('button[type="submit"]');
        const originalText=submitButton.textContent;
        submitButton.textContent='Submitting...';
        submitButton.disabled=!0;
        
        const templateParams={
            name:name,
            email:'Review Submission',
            phone:'N/A',
            projectType:`${rating} Star Review`,
            message:review
        };
        
        try{
            const response=await emailjs.send(
                'service_562c71o',
                'template_jxog6i3',
                templateParams
            );
            
            console.log('Review EmailJS Success:',response.status,response.text);
            showNotification('Thank you for your review! We appreciate your feedback.','success');
            reviewForm.reset();
        }catch(error){
            console.error('Review EmailJS Error:',error);
            
            try{
                const emailContent=`
New Customer Review

Customer: ${name}
Rating: ${rating} stars
Review: ${review}

This review was submitted through the website contact form.
                `.trim();
                
                const subject=encodeURIComponent('New Customer Review - Groves Real Estate Painting');
                const body=encodeURIComponent(emailContent);
                const mailtoLink=`mailto:Grovesrealestate@gmail.com?subject=${subject}&body=${body}`;
                window.location.href=mailtoLink;
                showNotification('Opening your email client to send the review.','info');
            }catch(fallbackError){
                console.error('Review fallback error:',fallbackError);
                showNotification('Failed to submit review. Please try again.','error');
            }
        }finally{
            submitButton.textContent=originalText;
            submitButton.disabled=!1;
        }
    });
}

function showNotification(message,type='info'){const existingNotifications=document.querySelectorAll('.notification');existingNotifications.forEach(notification=>notification.remove());const notification=document.createElement('div');notification.className=`notification notification-${type}`;notification.innerHTML=`
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;notification.style.cssText=`
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;if(window.innerWidth<=768){notification.style.top='80px';notification.style.right='10px';notification.style.left='10px';notification.style.maxWidth='none'}
notification.querySelector('.notification-content').style.cssText=`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;notification.querySelector('.notification-close').style.cssText=`
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;document.body.appendChild(notification);setTimeout(()=>{notification.style.transform='translateX(0)'},100);const closeButton=notification.querySelector('.notification-close');closeButton.addEventListener('click',()=>{notification.style.transform='translateX(100%)';setTimeout(()=>notification.remove(),300)});setTimeout(()=>{if(notification.parentNode){notification.style.transform='translateX(100%)';setTimeout(()=>notification.remove(),300)}},5000)}

function initThemeToggle(){const themeToggle=document.getElementById('themeToggle');if(!themeToggle)return;const sunIcon=themeToggle.querySelector('.sun-icon');const moonIcon=themeToggle.querySelector('.moon-icon');const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;let currentTheme=localStorage.getItem('theme')||(prefersDark?'dark':'light');setTheme(currentTheme);themeToggle.addEventListener('click',()=>{currentTheme=currentTheme==='dark'?'light':'dark';setTheme(currentTheme);localStorage.setItem('theme',currentTheme)});window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',(e)=>{if(!localStorage.getItem('theme')){currentTheme=e.matches?'dark':'light';setTheme(currentTheme)}});function setTheme(theme){document.documentElement.setAttribute('data-theme',theme);if(sunIcon&&moonIcon){if(theme==='dark'){sunIcon.style.display='none';moonIcon.style.display='block'}else{sunIcon.style.display='block';moonIcon.style.display='none'}}}}

function initVideoPlayer(){const video=document.getElementById('hero-video');if(!video)return;video.muted=!0;video.playsInline=!0;video.preload='auto';video.controls=!1;video.setAttribute('webkit-playsinline','true');video.setAttribute('playsinline','true');video.setAttribute('autoplay','true');video.setAttribute('muted','true');const forcePlay=async()=>{try{video.muted=!0;await video.play();console.log('Video playing')}catch(error){console.log('Video play failed:',error)}};const attemptAutoplay=async()=>{try{video.muted=!0;await video.play()}catch(error){console.log('Initial autoplay failed, setting up interaction listeners');const playOnInteraction=async()=>{await forcePlay();document.removeEventListener('touchstart',playOnInteraction);document.removeEventListener('click',playOnInteraction);document.removeEventListener('scroll',playOnInteraction)};document.addEventListener('touchstart',playOnInteraction,{once:!0,passive:!0});document.addEventListener('click',playOnInteraction,{once:!0});document.addEventListener('scroll',playOnInteraction,{once:!0,passive:!0})}};if(video.readyState>=3){attemptAutoplay()}else{video.addEventListener('loadeddata',attemptAutoplay,{once:!0})}
video.addEventListener('ended',()=>{video.currentTime=0;forcePlay()});const videoObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting&&video.paused){forcePlay()}else if(!entry.isIntersecting&&!video.paused){video.pause()}})},{threshold:0.25});videoObserver.observe(video)}

function initSoundToggle(){const soundToggle=document.getElementById('soundToggle');const video=document.getElementById('hero-video');if(!soundToggle||!video)return;const offIcon=soundToggle.querySelector('.sound-off-icon');const onIcon=soundToggle.querySelector('.sound-on-icon');function syncIcons(){const muted=video.muted;if(offIcon)offIcon.style.display=muted?'block':'none';if(onIcon)onIcon.style.display=muted?'none':'block';soundToggle.classList.toggle('sound-on',!muted);soundToggle.setAttribute('aria-label',muted?'Enable Sound':'Disable Sound')}
syncIcons();soundToggle.addEventListener('click',()=>{video.muted=!video.muted;syncIcons()})}

function initScrollEffects(){let ticking=!1;window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const scrolled=window.pageYOffset;const hero=document.querySelector('.hero');if(hero&&scrolled<window.innerHeight){hero.style.transform=`translateY(${scrolled * -0.3}px)`}
ticking=!1});ticking=!0}},{passive:!0})}

function triggerInitialAnimations(){const heroTitle=document.querySelector('.hero-title');const heroSubtitle=document.querySelector('.hero-subtitle');const ctaButton=document.querySelector('.cta-button');if(heroTitle){setTimeout(()=>heroTitle.classList.add('fade-in'),200)}
if(heroSubtitle){setTimeout(()=>heroSubtitle.classList.add('fade-in'),400)}
if(ctaButton){setTimeout(()=>ctaButton.classList.add('fade-in'),600)}}

function initBackToTop(){const backToTop=document.getElementById('backToTop');if(!backToTop)return;window.addEventListener('scroll',()=>{if(window.scrollY>300){backToTop.classList.add('show')}else{backToTop.classList.remove('show')}},{passive:!0});backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})})}

function initLoadingOverlay(){const loadingOverlay=document.getElementById('loadingOverlay');if(!loadingOverlay)return;window.addEventListener('load',()=>{setTimeout(()=>{loadingOverlay.classList.add('hide')},500)})}

function showEmailDialog(subject,body,email){const existingDialog=document.querySelector('.email-dialog');if(existingDialog)existingDialog.remove();const dialog=document.createElement('div');dialog.className='email-dialog';dialog.innerHTML=`
        <div class="email-dialog-content">
            <h3>Send Your Quote Request</h3>
            <p>Copy the information below and send it to:</p>
            <p class="email-address"><strong>${email}</strong></p>
            <div class="email-preview">
                <div class="email-subject">
                    <strong>Subject:</strong> ${subject}
                </div>
                <div class="email-body">${body.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="dialog-buttons">
                <button class="copy-btn" onclick="copyEmailContent('${subject}', \`${body.replace(/`/g,'\\`')}\`)">Copy Email Content</button>
                <button class="close-btn" onclick="closeEmailDialog()">Close</button>
            </div>
        </div>
    `;dialog.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        padding: 20px;
    `;const content=dialog.querySelector('.email-dialog-content');content.style.cssText=`
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `;const emailPreview=dialog.querySelector('.email-preview');emailPreview.style.cssText=`
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        font-size: 0.9rem;
        max-height: 200px;
        overflow-y: auto;
    `;const buttons=dialog.querySelectorAll('button');buttons.forEach(btn=>{btn.style.cssText=`
            padding: 0.75rem 1.5rem;
            margin: 0.5rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `});const copyBtn=dialog.querySelector('.copy-btn');copyBtn.style.background='var(--primary-color)';copyBtn.style.color='white';const closeBtn=dialog.querySelector('.close-btn');closeBtn.style.background='#ccc';document.body.appendChild(dialog)}

function copyEmailContent(subject,body){const fullContent=`Subject: ${subject}\n\n${body}`;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(fullContent).then(()=>{showNotification('Email content copied! Now paste it in your email app.','success');setTimeout(()=>closeEmailDialog(),2000)}).catch(()=>{fallbackCopy(fullContent)})}else{fallbackCopy(fullContent)}}

function fallbackCopy(text){const textArea=document.createElement('textarea');textArea.value=text;textArea.style.cssText='position: fixed; top: -9999px;';document.body.appendChild(textArea);textArea.select();try{document.execCommand('copy');showNotification('Email content copied! Now paste it in your email app.','success');setTimeout(()=>closeEmailDialog(),2000)}catch(err){showNotification('Please manually copy the email content.','error')}
document.body.removeChild(textArea)}

function closeEmailDialog(){const dialog=document.querySelector('.email-dialog');if(dialog)dialog.remove()}

function initActiveNav(){const sections=document.querySelectorAll('section[id]');const navLinks=document.querySelectorAll('.nav-menu a');const navbar=document.querySelector('.navbar');function setActive(){const navHeight=navbar?navbar.offsetHeight:70;let current='';sections.forEach(section=>{if(window.scrollY>=section.offsetTop-navHeight-60)current=section.id});navLinks.forEach(link=>{link.classList.toggle('active',link.getAttribute('href')==='#'+current)})}
window.addEventListener('scroll',setActive,{passive:true});setActive()}

function downloadVCard(){
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Jarrod Groves
ORG:Groves Real Estate Painting
TEL;TYPE=CELL,WORK:8148732129
TEL;TYPE=CELL,WORK:8148812723
EMAIL:Grovesrealestate@gmail.com
URL:https://www.grovesrealestatepainting.com
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jarrod_Groves_Contact.vcf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    showVCardNotification();
}

function showVCardNotification(){
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = 'Contact saved! Check your downloads folder.';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

window.copyEmailContent=copyEmailContent;
window.closeEmailDialog=closeEmailDialog;
window.addEventListener('error',(e)=>console.error('JS Error:',e.error))
