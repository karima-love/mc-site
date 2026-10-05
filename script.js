document.addEventListener("DOMContentLoaded", () => {
    
    // --- عناصر الصوت ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    bgMusic.volume = 0.25;

    let isPlaying = false;

    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = "🎵 شغلي الموسيقى";
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.innerHTML = "🎵 وقفي الموسيقى";
            }).catch(e => console.log("Autoplay blocked by browser."));
        }
        isPlaying = !isPlaying;
    };

    musicToggle.addEventListener('click', toggleMusic);

    // محاولة تشغيل الموسيقى عند أول تفاعل للمستخدم مع الموقع
    document.body.addEventListener('click', () => {
        if (!isPlaying) toggleMusic();
    }, { once: true });


    // --- نظام تسلسل المشاهد والتفاعلات ---
    const sceneBouquet = document.getElementById('scene-bouquet');
    const sceneEnvelope = document.getElementById('scene-envelope');
    const scrollContent = document.getElementById('scroll-content');
    
    const openBouquetBtn = document.getElementById('openBouquetBtn');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const readLetterBtn = document.getElementById('readLetterBtn');
    const theEnvelope = document.querySelector('.envelope');
    const theLetter = document.getElementById('theLetter');

    let isEnvelopeOpened = false;

    // 1. عند ضغط "افتحيها" للبوكيه
    openBouquetBtn.addEventListener('click', () => {
        sceneBouquet.style.opacity = '0';
        sceneBouquet.style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            sceneBouquet.classList.add('hidden');
            sceneEnvelope.classList.remove('hidden');
            // تأخير بسيط لبدء الأنيميشن
            setTimeout(() => {
                sceneEnvelope.style.opacity = '1';
            }, 100);
        }, 1500);
    });

    // 2. عند الضغط على الظرف نفسه لفتحه
    envelopeWrapper.addEventListener('click', () => {
        if (isEnvelopeOpened) return; // منع التكرار
        isEnvelopeOpened = true;

        envelopeWrapper.classList.add('is-open');
        theEnvelope.classList.add('open');
        
        // خروج الورقة جزئياً من الظرف وإظهار زر القراءة
        setTimeout(() => {
            theLetter.classList.add('lifted');
            readLetterBtn.classList.remove('hidden');
        }, 1200);
    });

    // 3. عند ضغط "اقري" للجواب
    readLetterBtn.addEventListener('click', () => {
        readLetterBtn.classList.add('hidden');
        document.querySelector('.envelope-text').classList.add('hidden');
        theLetter.classList.add('expanded');
        
        // إظهار المحتوى السفلي بعد الانتهاء من قراءة الرسالة
        setTimeout(() => {
            scrollContent.classList.remove('hidden');
            createPetals(); // تفعيل الجسيمات
        }, 3000);
    });

    // 4. التفاعل النهائي (زر نقعد سوا؟)
    const finalBtn = document.getElementById('finalBtn');
    const finalMessage = document.getElementById('finalMessage');

    finalBtn.addEventListener('click', () => {
        finalBtn.style.display = 'none';
        finalMessage.classList.remove('hidden');
        setTimeout(() => {
            finalMessage.classList.add('visible');
        }, 100);
        
        // زيادة الجسيمات كنوع من الفرحة أو الاحتفال الهادئ
        for(let i=0; i<15; i++) {
            setTimeout(createSinglePetal, i * 200);
        }
    });

    // --- نظام ظهور العناصر عند التمرير (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // إذا كان النص المتدرج، نعطيه تأخير
                if(entry.target.classList.contains('transition-section')) {
                    const texts = entry.target.querySelectorAll('.stagger-text');
                    texts.forEach((text, index) => {
                        setTimeout(() => {
                            text.classList.add('visible');
                        }, index * 1000);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal, .transition-section').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- نظام الجسيمات المتطايرة (Petals) ---
    const particlesContainer = document.getElementById('particles-container');

    function createSinglePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // عشوائية الحجم والمكان
        const size = Math.random() * 10 + 5; // بين 5px و 15px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}vw`;
        
        // عشوائية سرعة السقوط
        const duration = Math.random() * 5 + 8; // بين 8 و 13 ثانية
        petal.style.animationDuration = `${duration}s`;
        
        // ألوان عشوائية بين الوردي الهادئ والأزرق والأبيض
        const colors = ['#F6C8D8', '#B9DFF2', '#FFFDF9'];
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(petal);

        // إزالة العنصر بعد انتهاء الأنيميشن
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }

    function createPetals() {
        setInterval(createSinglePetal, 2000); // إنشاء ورقة كل ثانيتين
    }

});