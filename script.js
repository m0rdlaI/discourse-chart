const initialMarkerPositions = {
    m1: 20, 
    m2: 40, 
    m3: 60, 
    m4: 80  
};

let currentTabStates = {
    tab1: { ...initialMarkerPositions },
    tab2: { ...initialMarkerPositions },
    tab3: { ...initialMarkerPositions }
};

const markersData = [
    { id: 'm1', text: 'Guardian of Religious Tradition', color: 'm1' },
    { id: 'm2', text: 'Cultural Patrimony Promoter', color: 'm2' },
    { id: 'm3', text: 'Spiritual Holistic', color: 'm3' },
    { id: 'm4', text: 'Total Artification', color: 'm4' }
];

function generateChartHTML(tabId, isDraggable = true, isComparison = false) {
    let dragClass = isDraggable ? 'is-draggable' : '';
    let markersHTML = markersData.map(marker => `
        <div class="marker-group ${dragClass} marker-${marker.id}" data-marker-id="${marker.id}">
            <div class="marker-tooltip">${marker.text}</div>
            <div class="marker-diamond marker-color-${marker.color}"></div>
        </div>
    `).join('');

    return `
        <div class="chart-wrapper" data-tab-id="${tabId}">
            <div class="line-axis"></div>
            <span class="axis-label left">Religious Discourse</span>
            <span class="axis-label right">Secular Discourse</span>
            ${markersHTML}
        </div>
    `;
}

function initLegend() {
    const legendContainer = document.getElementById('global-legend');
    legendContainer.innerHTML = markersData.map(marker => `
        <div class="legend-item">
            <div class="legend-diamond marker-color-${marker.color}"></div>
            <span>${marker.text}</span>
        </div>
    `).join('');
}

function initCharts() {
    document.getElementById('interactive-chart-tab1').innerHTML = generateChartHTML('tab1', false); 
    document.getElementById('interactive-chart-tab2').innerHTML = generateChartHTML('tab2', true);  
    document.getElementById('interactive-chart-tab3').innerHTML = generateChartHTML('tab3', true);  
    
    initLegend();
    
    applyMarkersPositions('tab1');
    applyMarkersPositions('tab2');
    applyMarkersPositions('tab3');
    
    initDragAndDrop();
}

function applyMarkersPositions(tabId) {
    const positions = currentTabStates[tabId];
    const container = document.querySelector(`.chart-wrapper[data-tab-id="${tabId}"]`);
    
    if (!container) return;

    for (const markerId in positions) {
        const markerElement = container.querySelector(`.marker-${markerId}`);
        if (markerElement) {
            markerElement.style.left = `${positions[markerId]}%`;
        }
    }
}

function updateComparisonStack() {
    const stackContainer = document.getElementById('comparison-stack');
    
    const referenceLinesHTML = markersData.map(marker => {
        const pos = currentTabStates['tab1'][marker.id];
        return `<div class="reference-line" style="left: ${pos}%; border-color: var(--color-${marker.color});"></div>`;
    }).join('');

    const createComparisonBlock = (tabId, title) => {
        return `
            <div class="comparison-block">
                <span class="comparison-title" style="font-size: 1.35rem; margin-bottom: 0;">${title}</span>
                ${generateChartHTML(tabId + '-compare', false, true)}
            </div>
        `;
    };

    // Use the correctly updated titles for the generated comparison blocks
    const blocksHTML = 
        createComparisonBlock('tab1', "Ideal types setting") +
        createComparisonBlock('tab2', "Islamic context") +
        createComparisonBlock('tab3', "Interfaith context");

    stackContainer.innerHTML = referenceLinesHTML + blocksHTML;
    
    copyPositionsForComparison('tab1', 'tab1-compare');
    copyPositionsForComparison('tab2', 'tab2-compare');
    copyPositionsForComparison('tab3', 'tab3-compare');
}

function copyPositionsForComparison(sourceTabId, targetTabId) {
    const positions = currentTabStates[sourceTabId];
    const container = document.querySelector(`.chart-wrapper[data-tab-id="${targetTabId}"]`);
    if (!container) return;
    
    for (const markerId in positions) {
        const markerElement = container.querySelector(`.marker-${markerId}`);
        if (markerElement) {
            markerElement.style.left = `${positions[markerId]}%`;
        }
    }
}

function openTab(tabName, elmnt) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    let tablinks = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).style.display = "block";
    void document.getElementById(tabName).offsetWidth;
    document.getElementById(tabName).classList.add("active");
    elmnt.classList.add("active");
    
    if (tabName === 'tab4') {
        updateComparisonStack();
    }
}

let isDragging = false;
let dragStartX = 0;
let currentMarkerGroup = null;
let chartRect = null;
let currentPercentLeft = 0;
let currentTabId = null;
let currentMarkerId = null;

function initDragAndDrop() {
    const draggableMarkers = document.querySelectorAll('.marker-group.is-draggable');
    
    draggableMarkers.forEach(marker => {
        marker.addEventListener('mousedown', dragStart);
        marker.addEventListener('touchstart', dragStart, { passive: false });
    });
}

function dragStart(e) {
    if(e.type === 'mousedown' && e.button !== 0) return; 
    e.preventDefault();
    
    isDragging = true;
    currentMarkerGroup = e.currentTarget;
    currentMarkerGroup.classList.add('dragging');
    
    chartRect = currentMarkerGroup.parentElement.getBoundingClientRect();
    currentTabId = currentMarkerGroup.parentElement.dataset.tabId;
    currentMarkerId = currentMarkerGroup.dataset.markerId;
    
    if (e.type === 'touchstart') {
        dragStartX = e.touches[0].clientX;
    } else {
        dragStartX = e.clientX;
    }
    
    currentPercentLeft = parseFloat(currentMarkerGroup.style.left || currentTabStates[currentTabId][currentMarkerId]);
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove, { passive: false });
    
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
}

function dragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let clientX;
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
    } else {
        clientX = e.clientX;
    }
    
    const deltaX = clientX - dragStartX;
    const deltaPercent = (deltaX / chartRect.width) * 100;
    
    let newPercent = currentPercentLeft + deltaPercent;
    newPercent = Math.max(0, Math.min(100, newPercent));
    
    currentMarkerGroup.style.left = `${newPercent}%`;
    currentTabStates[currentTabId][currentMarkerId] = newPercent;
}

function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    currentMarkerGroup.classList.remove('dragging');
    
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
}

window.onload = function() {
    initCharts();
    document.getElementsByClassName("tab-button")[0].click();
};
