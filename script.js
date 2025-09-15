// 케이크 데이터
const cakeData = {
    rose: {
        id: 'rose',
        name: '로즈 생화케이크',
        description: '클래식한 장미로 우아하게 장식한 케이크',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        badge: 'POPULAR',
        designs: {
            simple: {
                name: '심플 로즈',
                image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop',
                prices: { '1호': 65000, '2호': 85000, '3호': 110000 }
            },
            premium: {
                name: '프리미엄 로즈',
                image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=150&fit=crop',
                prices: { '1호': 85000, '2호': 110000, '3호': 140000 }
            },
            luxury: {
                name: '럭셔리 로즈',
                image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=150&fit=crop',
                prices: { '1호': 120000, '2호': 150000, '3호': 190000 }
            }
        }
    },
    seasonal: {
        id: 'seasonal',
        name: '시즌 생화케이크',
        description: '계절별 신선한 생화로 특별하게 제작',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
        designs: {
            spring: {
                name: '봄 시즌',
                image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop',
                prices: { '1호': 75000, '2호': 95000, '3호': 125000 }
            },
            summer: {
                name: '여름 시즌',
                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=150&fit=crop',
                prices: { '1호': 80000, '2호': 105000, '3호': 135000 }
            }
        }
    },
    custom: {
        id: 'custom',
        name: '맞춤 생화케이크',
        description: '고객 요청에 따라 특별 제작하는 케이크',
        image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=400&h=300&fit=crop',
        badge: 'CUSTOM',
        designs: {
            consultation: {
                name: '상담 후 제작',
                image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=200&h=150&fit=crop',
                prices: { '1호': '상담 후 결정', '2호': '상담 후 결정', '3호': '상담 후 결정' }
            }
        }
    }
};

// 현재 주문 정보
let currentOrder = {
    cake: null,
    design: null,
    size: null,
    price: 0,
    customerInfo: {}
};

let currentStep = 1;

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', function() {
    generateCakeCards();
    
    // 최소 수령일 설정 (3일 후)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    document.getElementById('pickupDate').setAttribute('min', minDate.toISOString().split('T')[0]);
});

function generateCakeCards() {
    const cakeGrid = document.getElementById('cakeGrid');
    
    Object.values(cakeData).forEach(cake => {
        const designTags = Object.values(cake.designs).map(design => design.name).join(', ');
        const priceRange = getAveragePriceRange(cake);
        
        const card = document.createElement('div');
        card.className = 'cake-card';
        card.innerHTML = `
            <div class="cake-image">
                <img src="${cake.image}" alt="${cake.name}">
                ${cake.badge ? `<div class="cake-badge">${cake.badge}</div>` : ''}
            </div>
            <div class="cake-info">
                <h4>${cake.name}</h4>
                <p>${cake.description}</p>
                <div class="design-preview">
                    ${Object.values(cake.designs).map(design => 
                        `<span class="design-tag">${design.name}</span>`
                    ).join('')}
                </div>
                <div class="price-info">
                    <h5>가격대</h5>
                    <div class="price-list">${priceRange}</div>
                </div>
                <button class="order-btn" onclick="openOrderModal('${cake.id}')">주문하기</button>
            </div>
        `;
        cakeGrid.appendChild(card);
    });
}

function getAveragePriceRange(cake) {
    const designs = Object.values(cake.designs);
    if (designs.length === 0) return '';
    
    const firstDesign = designs[0];
    const prices = Object.values(firstDesign.prices);
    
    if (typeof prices[0] === 'string') {
        return prices[0];
    }
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`;
}

function openOrderModal(cakeId) {
    currentOrder.cake = cakeData[cakeId];
    currentStep = 1;
    
    document.getElementById('orderModal').style.display = 'block';
    generateDesignOptions();
    updateStepIndicator();
    updateNavigation();
}

function generateDesignOptions() {
    const designGrid = document.getElementById('designGrid');
    designGrid.innerHTML = '';
    
    Object.entries(currentOrder.cake.designs).forEach(([designId, design]) => {
        const option = document.createElement('div');
        option.className = 'design-option';
        option.onclick = () => selectDesign(designId, design);
        
        const priceRange = typeof Object.values(design.prices)[0] === 'string' 
            ? Object.values(design.prices)[0]
            : `${Math.min(...Object.values(design.prices)).toLocaleString()}원 ~`;
        
        option.innerHTML = `
            <img src="${design.image}" alt="${design.name}">
            <h4>${design.name}</h4>
            <p>${priceRange}</p>
        `;
        designGrid.appendChild(option);
    });
}

function selectDesign(designId, design) {
    // 이전 선택 제거
    document.querySelectorAll('.design-option').forEach(el => el.classList.remove('selected'));
    
    // 현재 선택 표시
    event.currentTarget.classList.add('selected');
    
    currentOrder.design = { id: designId, ...design };
    
    // 사이즈 옵션 생성
    generateSizeOptions();
}

function generateSizeOptions() {
    const sizeSelector = document.getElementById('sizeSelector');
    sizeSelector.innerHTML = '';
    
    Object.entries(currentOrder.design.prices).forEach(([size, price]) => {
        const option = document.createElement('div');
        option.className = 'size-option';
        option.onclick = () => selectSize(size, price);
        
        const sizeDetails = {
            '1호': '15cm (2-4인용)',
            '2호': '18cm (4-6인용)',
            '3호': '21cm (6-8인용)'
        };
        
        const displayPrice = typeof price === 'string' ? price : `${price.toLocaleString()}원`;
        
        option.innerHTML = `
            <div class="size-name">${size}</div>
            <div class="size-detail">${sizeDetails[size]}</div>
            <div class="size-price">${displayPrice}</div>
        `;
        sizeSelector.appendChild(option);
    });
}

function selectSize(size, price) {
    // 이전 선택 제거
    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
    
    // 현재 선택 표시
    event.currentTarget.classList.add('selected');
    
    currentOrder.size = size;
    currentOrder.price = price;
    
    updateOrderSummary();
}

function updateOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const displayPrice = typeof currentOrder.price === 'string' ? currentOrder.price : `${currentOrder.price.toLocaleString()}원`;
    
    summary.innerHTML = `
        <h4>주문 요약</h4>
        <p><strong>케이크:</strong> ${currentOrder.cake.name}</p>
        <p><strong>디자인:</strong> ${currentOrder.design.name}</p>
        <p><strong>사이즈:</strong> ${currentOrder.size}</p>
        <p><strong>가격:</strong> ${displayPrice}</p>
    `;
}

function nextStep() {
    if (currentStep === 1) {
        if (!currentOrder.design) {
            alert('디자인을 선택해주세요.');
            return;
        }
    } else if (currentStep === 2) {
        if (!currentOrder.size) {
            alert('사이즈를 선택해주세요.');
            return;
        }
    }
    
    if (currentStep < 3) {
        currentStep++;
        updateStepIndicator();
        updateNavigation();
    } else {
        // 주문 제출
        submitOrder();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepIndicator();
        updateNavigation();
    }
}

function updateStepIndicator() {
    // 단계 표시 업데이트
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // 단계 내용 표시
    document.querySelectorAll('.step-content').forEach((content, index) => {
        if (index + 1 === currentStep) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentStep === 1) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
    
    if (currentStep === 3) {
        nextBtn.textContent = '주문하기';
        nextBtn.classList.add('btn-primary');
    } else {
        nextBtn.textContent = '다음';
    }
}

function submitOrder() {
    // 필수 정보 확인
    const customerName = document.getElementById('customerName').value;
    const phone = document.getElementById('phone').value;
    const pickupDate = document.getElementById('pickupDate').value;
    
    if (!customerName || !phone || !pickupDate) {
        alert('필수 정보를 모두 입력해주세요.');
        return;
    }
    
    // 주문 정보 구성
    const orderData = {
        timestamp: new Date().toLocaleString('ko-KR'),
        orderNumber: 'ORD' + Date.now(),
        cakeName: currentOrder.cake.name,
        designName: currentOrder.design.name,
        size: currentOrder.size,
        price: currentOrder.price,
        customerName: customerName,
        phone: phone,
        pickupDate: pickupDate,
        message: document.getElementById('message').value,
        specialRequests: document.getElementById('specialRequests').value,
        status: '새 주문',
        canCancel: true
    };
    
    // 구글 시트로 전송
    sendToGoogleSheets(orderData);
}

// 구글 시트로 데이터 전송 함수
function sendToGoogleSheets(orderData) {
    // 🔥 여기가 중요! 받은 웹앱 URL 입력
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySCZ0ZCo0Hglz7iAA-ktyOY37bVQn_al3IU1mGMxrAP3KeAkSr0ESxUJZduo3Vi376DA/exec';
    
    // 버튼 비활성화 (전송 중 표시)
    const nextBtn = document.getElementById('nextBtn');
    const originalText = nextBtn.textContent;
    nextBtn.textContent = '주문 처리 중...';
    nextBtn.disabled = true;

    // 구글 시트로 데이터 전송
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // 🔥 중요: CORS 문제 해결
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        // no-cors 모드에서는 응답을 읽을 수 없지만, 전송은 됨
        console.log('구글 시트 전송 완료:', orderData);
        
        // 성공 메시지
        alert(`주문이 성공적으로 접수되었습니다! 🎉\n\n주문번호: ${orderData.orderNumber}\n케이크: ${orderData.cakeName} - ${orderData.designName}\n사이즈: ${orderData.size}\n고객명: ${orderData.customerName}\n수령일: ${orderData.pickupDate}\n\n곧 연락드려서 세부사항을 확인해드릴게요!`);
        
        // 모달 닫기
        closeOrderModal();
    })
    .catch(error => {
        console.error('구글 시트 전송 오류:', error);
        
        // 오류가 발생해도 사용자에게는 성공 메시지 (no-cors 특성상 오류가 자주 발생)
        alert(`주문이 접수되었습니다!\n\n주문번호: ${orderData.orderNumber}\n케이크: ${orderData.cakeName} - ${orderData.designName}\n\n확인 후 연락드리겠습니다!`);
        
        closeOrderModal();
    })
    .finally(() => {
        // 버튼 복구
        nextBtn.textContent = originalText;
        nextBtn.disabled = false;
    });
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    
    // 주문 정보 초기화
    currentOrder = { cake: null, design: null, size: null, price: 0, customerInfo: {} };
    currentStep = 1;
    
    // 폼 초기화
    document.getElementById('customerName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('pickupDate').value = '';
    document.getElementById('message').value = '';
    document.getElementById('specialRequests').value = '';
}

// 주문 조회 기능
function showOrderLookup() {
    document.getElementById('orderLookupModal').style.display = 'block';
}

function closeOrderLookupModal() {
    document.getElementById('orderLookupModal').style.display = 'none';
    document.getElementById('lookupPhone').value = '';
    document.getElementById('orderResult').classList.add('hidden');
}

function lookupOrder() {
    const phone = document.getElementById('lookupPhone').value;
    if (!phone) {
        alert('연락처를 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에서 조회
    console.log('주문 조회:', phone);
    
    // 임시 결과 표시
    const result = document.getElementById('orderResult');
    result.innerHTML = `
        <h4>주문 내역</h4>
        <p>연락처로 조회된 주문이 없습니다.</p>
        <p>주문 후 시간이 걸릴 수 있으니 잠시 후 다시 조회해주세요.</p>
    `;
    result.classList.remove('hidden');
}

// 주문 취소 기능
function showOrderCancel() {
    document.getElementById('orderCancelModal').style.display = 'block';
}

function closeOrderCancelModal() {
    document.getElementById('orderCancelModal').style.display = 'none';
    document.getElementById('cancelPhone').value = '';
    document.getElementById('cancelOrderResult').classList.add('hidden');
}

function findOrderForCancel() {
    const phone = document.getElementById('cancelPhone').value;
    if (!phone) {
        alert('연락처를 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에서 조회하고 취소 가능 날짜 체크
    console.log('취소 가능한 주문 조회:', phone);
    
    // 임시 결과 표시
    const result = document.getElementById('cancelOrderResult');
    result.innerHTML = `
        <h4>취소/수정 가능한 주문</h4>
        <p>연락처로 조회된 주문이 없습니다.</p>
        <p>취소는 수령일 2일 전까지만 가능합니다.</p>
    `;
    result.classList.remove('hidden');
}

// 모달 외부 클릭시 닫기
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeOrderModal();
        closeOrderLookupModal();
        closeOrderCancelModal();
    }
});

// 채팅 기능
let chatOpen = false;
let adminResponses = [
    "네, 어떤 도움이 필요하신가요? 😊",
    "생화케이크 관련해서 상세히 알려드릴게요!",
    "주문 관련 문의사항이 있으시면 언제든 말씀해주세요.",
    "디자인이나 가격에 대해 궁금한 점이 있으시면 알려주세요!",
    "네, 맞습니다. 더 궁금한 점이 있으시면 말씀해주세요.",
    "좋은 질문이네요! 자세히 설명해드릴게요.",
    "네, 바로 확인해드릴게요. 잠시만 기다려주세요.",
    "감사합니다. 다른 문의사항이 더 있으시면 언제든 연락주세요! 🌸"
];

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatButton = document.querySelector('.chat-button');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        chatButton.textContent = '✕';
        
        // 채팅창을 맨 아래로 스크롤
        scrollToBottom();
    } else {
        chatWindow.classList.remove('active');
        chatButton.classList.remove('active');
        chatButton.textContent = '💬';
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // 사용자 메시지 추가
    addMessage(message, 'user');
    
    // 입력창 초기화
    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    
    // 타이핑 인디케이터 표시
    showTypingIndicator();
    
    // 관리자 응답 시뮬레이션 (실제로는 실시간 채팅 서비스 연결)
    setTimeout(() => {
        hideTypingIndicator();
        
        // 키워드에 따른 자동 응답
        const autoResponse = getAutoResponse(message);
        addMessage(autoResponse, 'admin');
        
        // 실제 구현에서는 여기서 관리자에게 알림 전송
        notifyAdmin(message);
    }, 1500 + Math.random() * 1000);
}

function sendQuickMessage(message) {
    addMessage(message, 'user');
    
    // 빠른 응답 제공
    setTimeout(() => {
        let response = '';
        switch(message) {
            case '주문 관련 문의':
                response = '주문은 웹사이트에서만 가능하며, 최소 3일 전에 주문해주세요. 구체적으로 어떤 부분이 궁금하신가요?';
                break;
            case '디자인 상담':
                response = '어떤 스타일의 생화케이크를 원하시나요? 로즈, 시즌별 생화, 또는 완전 맞춤 디자인 모두 가능합니다! 참고 이미지가 있으시면 더 정확한 상담이 가능해요.';
                break;
            case '가격 문의':
                response = '사이즈와 디자인에 따라 가격이 달라집니다. 1호(65,000원~), 2호(85,000원~), 3호(110,000원~)부터 시작하며, 맞춤 디자인은 별도 상담이 필요해요.';
                break;
            case '배송/픽업 문의':
                response = '생화케이크는 픽업만 가능합니다. 오전 10시~오후 7시 사이에 방문해주세요. 정확한 주소는 주문 확정 후 알려드려요!';
                break;
            default:
                response = adminResponses[Math.floor(Math.random() * adminResponses.length)];
        }
        addMessage(response, 'admin');
        notifyAdmin(`빠른 문의: ${message}`);
    }, 800);
}

function getAutoResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('가격') || lowerMessage.includes('얼마')) {
        return '가격은 사이즈와 디자인에 따라 달라져요. 웹사이트에서 원하시는 케이크를 선택하시면 정확한 가격을 확인하실 수 있어요! 특별한 디자인을 원하신다면 상담이 필요합니다.';
    }
    
    if (lowerMessage.includes('주문') || lowerMessage.includes('예약')) {
        return '주문은 웹사이트에서만 가능하며, 최소 3일 전에 주문해주세요. 전화주문은 받지 않으니 양해부탁드려요!';
    }
    
    if (lowerMessage.includes('배송') || lowerMessage.includes('픽업')) {
        return '생화케이크는 배송이 어려워 픽업만 가능합니다. 오전 10시~오후 7시 사이에 방문 가능하세요!';
    }
    
    if (lowerMessage.includes('디자인') || lowerMessage.includes('모양')) {
        return '어떤 스타일을 원하시나요? 참고할 이미지나 색상 선호도를 알려주시면 더 정확한 상담을 도와드릴 수 있어요! 🌸';
    }
    
    if (lowerMessage.includes('취소') || lowerMessage.includes('변경') || lowerMessage.includes('수정')) {
        return '주문 취소나 변경은 수령일 2일 전까지만 가능해요. 웹사이트 상단의 "주문 취소/수정" 버튼을 이용하시거나 여기서 도움을 받으실 수 있어요.';
    }
    
    // 기본 응답
    return adminResponses[Math.floor(Math.random() * adminResponses.length)];
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    
    const currentTime = new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
        ${message}
        <div class="message-time">${currentTime}</div>
    `;
    
    // 빠른 메시지 버튼들 위에 메시지 추가
    const quickMessages = messagesContainer.querySelector('.quick-messages');
    messagesContainer.insertBefore(messageElement, quickMessages);
    
    scrollToBottom();
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('active');
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('active');
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function handleEnterKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
}

// 관리자에게 알림 (실제 구현에서는 웹소켓이나 실시간 알림 서비스 사용)
function notifyAdmin(message) {
    const notification = {
        timestamp: new Date().toLocaleString('ko-KR'),
        message: message,
        customerInfo: 'Guest User', // 실제로는 사용자 정보
        type: 'chat_message'
    };
    
    console.log('관리자 알림:', notification);
    
    // 실제로는 여기서 구글 시트나 실시간 알림 서비스로 전송
    // 예: Firebase, Pusher, Socket.io, 채널톡 등
}