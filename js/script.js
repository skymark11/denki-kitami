/**
 * 北見の街の電気屋さん - メインJavaScript
 * 個人向けメイン + ユーザビリティ向上 + スライドショー機能
 */

// ====================================
// グローバル変数
// ====================================
let currentSlideIndex = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

// ====================================
// スライドショー機能
// ====================================
function showSlide(index) {
    // すべてのスライドを非アクティブに
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 指定されたスライドをアクティブに
    if (slides[index]) {
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlideIndex = index;
    }
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    showSlide(newIndex);
    resetAutoPlay();
}

function currentSlide(index) {
    showSlide(index - 1); // HTMLでは1から始まるインデックス
    resetAutoPlay();
}

function nextSlide() {
    changeSlide(1);
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // 5秒間隔
}

// スライドショーの初期化
function initSlideshow() {
    if (slides.length > 0) {
        showSlide(0);
        resetAutoPlay();
        
        // マウスオーバーで自動再生を停止
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            slideshowContainer.addEventListener('mouseleave', () => {
                resetAutoPlay();
            });
        }
        
        // キーボードナビゲーション
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });
    }
}

// ====================================
// モバイルメニュー機能
// ====================================
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const isOpen = mobileMenu.style.display === 'block';
    
    if (isOpen) {
        mobileMenu.style.display = 'none';
    } else {
        mobileMenu.style.display = 'block';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.style.display = 'none';
}

// グローバル関数として公開（HTMLから呼び出し可能）
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

document.addEventListener('DOMContentLoaded', function() {
    
    // スライドショーの初期化
    initSlideshow();
    
    // ====================================
    // スムーススクロール
    // ====================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // 電話番号のクリック追跡
    // ====================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics イベント送信（実装時に有効化）
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    event_category: 'engagement',
                    event_label: 'header_phone_click'
                });
            }
            
            console.log('電話番号クリック:', this.href);
        });
    });

    // ====================================
    // フォーム送信処理
    // ====================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // フォームデータ収集
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                tel: formData.get('tel'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message')
            };

            // バリデーション
            if (!data.name || !data.tel) {
                showFormMessage('すべての必須項目を入力してください', 'error');
                return;
            }

            // 送信ボタン無効化
            const submitBtn = this.querySelector('#submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
            submitBtn.disabled = true;

            // フォーム送信
            fetch('send_mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                // 送信ボタンを元に戻す
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                if (result.success) {
                    // フォームをリセット
                    contactForm.reset();
                    // 成功ポップアップを表示
                    showSuccessPopup();
                } else {
                    // エラーメッセージを表示
                    showFormMessage(result.message || 'エラーが発生しました', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // 送信ボタンを元に戻す
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                // エラーメッセージを表示
                showFormMessage('送信に失敗しました。お電話でお問い合わせください。', 'error');
            });
        });
    }

    // ====================================
    // フォームバリデーション
    // ====================================
    function validateForm(data) {
        let isValid = true;
        
        // 既存のエラーメッセージをクリア
        clearErrorMessages();
        
        // 必須項目チェック
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'お名前は2文字以上で入力してください');
            isValid = false;
        }
        
        if (!data.tel || !isValidPhoneNumber(data.tel)) {
            showFieldError('tel', '正しい電話番号を入力してください');
            isValid = false;
        }
        
        // メールアドレス（任意だが、入力されている場合はチェック）
        if (data.email && !isValidEmail(data.email)) {
            showFieldError('email', '正しいメールアドレスを入力してください');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidPhoneNumber(phone) {
        // 日本の電話番号パターン（簡易版）
        const phonePattern = /^[\d\-\(\)\s]{10,14}$/;
        return phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.style.borderColor = '#E74C3C';
            
            // エラーメッセージ表示
            let errorDiv = field.parentNode.querySelector('.error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = '#E74C3C';
                errorDiv.style.fontSize = '14px';
                errorDiv.style.marginTop = '5px';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        }
    }
    
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const fields = document.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '#E5E5E5';
        });
    }
    
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');

        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message';

            if (type === 'success') {
                formMessage.style.cssText = `
                    background-color: #10b981;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 15px 0;
                    font-weight: 500;
                `;
            } else if (type === 'error') {
                formMessage.style.cssText = `
                    background-color: #ef4444;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 15px 0;
                    font-weight: 500;
                `;
            }

            // メッセージを表示
            formMessage.style.display = 'block';

            // 成功メッセージは5秒後に自動的に消す
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }

    // ====================================
    // ヘッダーは常に固定（CSSで設定済み）
    // ====================================

    // ====================================
    // 新しいモバイルメニューはHTML/CSSで実装済み
    // ====================================

    // ====================================
    // パフォーマンス最適化: 画像の遅延読み込み
    // ====================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ====================================
    // アニメーション（スクロール時）
    // ====================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .reason-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初期実行

    // ====================================
    // 緊急時の電話ボタン強調（夜間時間帯）
    // ====================================
    const currentHour = new Date().getHours();
    
    // 夜間（18時〜8時）の場合、緊急電話ボタンを強調
    if (currentHour >= 18 || currentHour < 8) {
        const emergencyBtns = document.querySelectorAll('.btn-emergency, .cta-item.urgent');
        emergencyBtns.forEach(btn => {
            btn.style.animation = 'pulse 2s infinite';
        });
        
        // Pulse アニメーションの定義
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // ====================================
    // 統計カウンターアニメーション
    // ====================================
    function animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    function startCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, target);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // ====================================
    // 人気度バーアニメーション
    // ====================================
    function animatePopularityBars() {
        const bars = document.querySelectorAll('.popularity-fill[data-popularity]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const popularity = entry.target.getAttribute('data-popularity');
                    setTimeout(() => {
                        entry.target.style.width = popularity + '%';
                    }, 500);
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.5 });
        
        bars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // ====================================
    // サービスカテゴリホバーエフェクト強化
    // ====================================
    function enhanceServiceCardHovers() {
        const cards = document.querySelectorAll('.service-category-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // カードの統計数値にグロー効果を追加
                const statNumbers = this.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    num.style.textShadow = '0 0 10px rgba(74, 144, 226, 0.6)';
                });
                
                // パルスアイコンの強化
                const pulseIcon = this.querySelector('.pulse-icon');
                if (pulseIcon) {
                    pulseIcon.style.animationDuration = '1s';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // エフェクトをリセット
                const statNumbers = this.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    num.style.textShadow = '';
                });
                
                const pulseIcon = this.querySelector('.pulse-icon');
                if (pulseIcon) {
                    pulseIcon.style.animationDuration = '2s';
                }
            });
        });
    }
    
    // ====================================
    // 価格タグ強調エフェクト
    // ====================================
    function enhancePriceTags() {
        const priceTags = document.querySelectorAll('.animated-price');
        
        priceTags.forEach(price => {
            price.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            price.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // ====================================
    // 季節対応バッジの動的表示
    // ====================================
    function updateSeasonalBadges() {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const seasonalBadges = document.querySelectorAll('.seasonal-badge.hokkaido');
        
        // 冬季（11月〜3月）は「冬季対応強化」バッジを表示
        if (currentMonth >= 11 || currentMonth <= 3) {
            seasonalBadges.forEach(badge => {
                const icon = badge.querySelector('i');
                const text = badge.querySelector('span');
                if (icon && text) {
                    icon.className = 'fas fa-snowflake';
                    text.textContent = '冬季対応強化';
                    badge.style.animation = 'pulse 3s infinite';
                }
            });
        }
        
        // 夏季（6月〜9月）はエアコン強調
        if (currentMonth >= 6 && currentMonth <= 9) {
            const airconItems = document.querySelectorAll('.service-item');
            airconItems.forEach(item => {
                const title = item.querySelector('h4');
                if (title && title.textContent.includes('エアコン')) {
                    item.style.border = '2px solid #74b9ff';
                    item.style.borderRadius = '8px';
                    
                    // 夏季バッジを追加
                    const seasonalNote = document.createElement('span');
                    seasonalNote.className = 'service-badge winter';
                    seasonalNote.textContent = '夏季需要';
                    const badges = item.querySelector('.service-badges');
                    if (badges && !badges.querySelector('.service-badge[text="夏季需要"]')) {
                        badges.appendChild(seasonalNote);
                    }
                }
            });
        }
    }
    
    // ====================================
    // CTAボタンの強化エフェクト
    // ====================================
    function enhanceCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn-category.premium');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // クリック時のリップルエフェクト
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${e.offsetX}px;
                    top: ${e.offsetY}px;
                    width: 20px;
                    height: 20px;
                    margin-left: -10px;
                    margin-top: -10px;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // リップルエフェクトのCSS追加
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    // ====================================
    // 緊急度インジケーターの動的更新
    // ====================================
    function updateUrgencyIndicators() {
        const currentHour = new Date().getHours();
        const urgentStats = document.querySelectorAll('.stat-item.urgent');
        
        // 営業時間外（18時〜8時）は緊急対応を強調
        if (currentHour >= 18 || currentHour < 8) {
            urgentStats.forEach(stat => {
                const label = stat.querySelector('.stat-label');
                if (label) {
                    label.style.color = '#e74c3c';
                    label.style.fontWeight = '700';
                    label.textContent = '緊急24時間対応';
                }
                
                const icon = stat.querySelector('.stat-icon i');
                if (icon) {
                    icon.style.animation = 'pulse 1s infinite';
                }
            });
        }
    }
    
    // ====================================
    // パフォーマンス監視とデバッグ
    // ====================================
    function logPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`サイト読み込み時間: ${loadTime}ms`);
            
            // 統計情報をコンソールに出力（開発用）
            console.log('サービスカテゴリ強化機能:', {
                '統計カウンター': document.querySelectorAll('.stat-number').length + '個',
                '人気度バー': document.querySelectorAll('.popularity-fill').length + '個',
                'プレミアムボタン': document.querySelectorAll('.btn-category.premium').length + '個',
                '季節対応バッジ': document.querySelectorAll('.seasonal-badge').length + '個'
            });
        }
    }
    
    // ====================================
    // 機能の初期化実行
    // ====================================
    startCounterAnimation();
    animatePopularityBars();
    enhanceServiceCardHovers();
    enhancePriceTags();
    updateSeasonalBadges();
    enhanceCTAButtons();
    updateUrgencyIndicators();
    logPerformanceMetrics();
    
    console.log('北見の街の電気屋さん - サイト初期化完了（強化版）');
});

// ====================================
// FAQ開閉機能
// ====================================
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // すべてのFAQを閉じる（アコーディオン形式）
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // クリックされたFAQを開く（既に開いていた場合は閉じる）
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// グローバル関数として公開
window.toggleFAQ = toggleFAQ;

// ====================================
// 成功ポップアップ表示
// ====================================
function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
    if (popup) {
        popup.style.display = 'flex';
        popup.classList.remove('hidden');
        // ページの最上部にスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 成功ポップアップを閉じる
function closeSuccessPopup() {
    const popup = document.getElementById('success-popup');
    if (popup) {
        popup.style.display = 'none';
        popup.classList.add('hidden');
    }
}

// 背景クリックで閉じる
document.addEventListener('click', function(e) {
    const popup = document.getElementById('success-popup');
    if (e.target === popup) {
        closeSuccessPopup();
    }
});

// ESCキーで閉じる
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessPopup();
    }
});

// グローバル関数として公開
window.showSuccessPopup = showSuccessPopup;
window.closeSuccessPopup = closeSuccessPopup;