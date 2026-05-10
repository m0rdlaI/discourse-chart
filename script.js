:root {
    --marker-size: 30px;
    --line-thickness: 6px;
    --color-m1: #10b981; 
    --color-m2: #3b82f6; 
    --color-m3: #8b5cf6; 
    --color-m4: #ef4444; 
    --bg-color: #f1f5f9;
    --surface-color: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --axis-color: #cbd5e1;
    --font-family: 'Inter', sans-serif;
    --border-radius: 18px;
}

body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: var(--font-family);
    display: flex;
    flex-direction: column;
    align-items: center;
}

h1#main-title {
    text-align: center;
    margin: 60px 30px 45px;
    font-size: 3rem;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: -0.02em;
}

.dashboard-container {
    width: 100%;
    max-width: 1800px;
    background: var(--surface-color);
    border-radius: var(--border-radius);
    box-shadow: 0 15px 35px -8px rgb(0 0 0 / 0.05), 0 12px 15px -9px rgb(0 0 0 / 0.01);
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
}

.tabs {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    background-color: #f8fafc;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.tab-button {
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 27px 36px;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--text-muted);
    flex-grow: 1;
    text-align: center;
    transition: all 0.2s ease;
    position: relative;
}

.tab-button:hover {
    color: var(--text-main);
    background-color: #f1f5f9;
}

.tab-button.active {
    color: var(--color-m2);
    background-color: var(--surface-color);
    font-weight: 600;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--color-m2);
}

.tab-content {
    display: none;
    padding: 60px;
    min-height: 375px; 
    box-sizing: border-box;
    animation: fadeIn 0.3s ease;
}

.tab-content.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.chart-wrapper {
    position: relative;
    height: 180px; 
    margin: 60px auto 0;
    width: 85%;
    box-sizing: border-box;
    user-select: none;
}

.line-axis {
    position: absolute;
    top: 90px; 
    left: 0;
    width: 100%;
    height: var(--line-thickness);
    background-color: var(--axis-color);
    border-radius: 3px;
}

.line-axis::before, .line-axis::after {
    content: '';
    position: absolute;
    top: -8px;
    width: 0;
    height: 0;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
}

.line-axis::before {
    left: -3px;
    border-right: 18px solid var(--axis-color);
}

.line-axis::after {
    right: -3px;
    border-left: 18px solid var(--axis-color);
}

.axis-label {
    position: absolute;
    top: 90px;
    transform: translateY(-50%);
    font-weight: 600;
    font-size: 1.5rem;
    color: var(--text-muted);
}

.axis-label.left { left: -240px; width: 210px; text-align: right; }
.axis-label.right { right: -240px; width: 210px; text-align: left; }

.marker-group {
    position: absolute;
    top: 90px;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
}

.marker-group.is-draggable {
    cursor: grab;
}

.marker-group.is-draggable:active, .marker-group.is-draggable.dragging {
    cursor: grabbing;
    z-index: 20;
}

.marker-diamond {
    width: var(--marker-size);
    height: var(--marker-size);
    transform: rotate(45deg);
    background-color: gray;
    box-shadow: 0 6px 9px -2px rgb(0 0 0 / 0.2);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
    border: 3px solid #fff;
}

.marker-group:hover .marker-diamond {
    transform: rotate(45deg) scale(1.25);
    box-shadow: 0 15px 22px -5px rgb(0 0 0 / 0.3);
}

.marker-group.is-draggable.dragging .marker-diamond {
    transform: rotate(45deg) scale(1.1);
    box-shadow: 0 12px 18px -3px rgb(0 0 0 / 0.25);
}

.marker-tooltip {
    position: absolute;
    bottom: 52px;
    white-space: nowrap;
    background: linear-gradient(90deg, #ff00cc, #3333ff, #00ffff);
    background-size: 200% 200%;
    animation: gradientMove 2s ease infinite;
    color: #ffffff;
    padding: 9px 18px;
    border-radius: 12px;
    font-size: 1.425rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    opacity: 0;
    transform: translateY(15px) scale(0.9);
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    pointer-events: none;
    box-shadow: 0 0 22px rgba(255, 0, 204, 0.6);
    z-index: 30;
}

.marker-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: #3333ff transparent transparent transparent;
}

.marker-group:hover .marker-tooltip,
.marker-group.dragging .marker-tooltip {
    opacity: 1;
    transform: translateY(0) scale(1);
}

@keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.marker-color-m1 { background-color: var(--color-m1); }
.marker-color-m2 { background-color: var(--color-m2); }
.marker-color-m3 { background-color: var(--color-m3); }
.marker-color-m4 { background-color: var(--color-m4); }

.legend-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    padding: 30px;
    background-color: #f8fafc;
    border-top: 2px solid #e2e8f0;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1.425rem;
    font-weight: 500;
    color: var(--text-main);
}

.legend-diamond {
    width: 21px;
    height: 21px;
    transform: rotate(45deg);
    border: 2px solid rgba(0,0,0,0.1);
}

#comparison-stack {
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: relative;
    width: 85%;
    margin: 0 auto;
    padding-top: 15px;
}

.reference-line {
    position: absolute;
    top: 45px; 
    bottom: 45px;
    border-left: 3px dashed;
    z-index: 5;
    opacity: 0.5;
    pointer-events: none;
}

.comparison-block {
    padding-bottom: 30px;
    pointer-events: none;
}

.comparison-block:not(:last-child) { border-bottom: 2px solid #f1f5f9; }

.comparison-title {
    font-weight: 600;
    font-size: 1.65rem;
    color: var(--text-muted);
    margin-bottom: 0px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
}

.comparison-block .chart-wrapper {
    height: 150px;
    margin: 15px 0 0 0;
    width: 100%; 
}

@media (max-width: 1350px) {
    .axis-label { font-size: 1.25rem; }
    .axis-label.left { left: -150px; width: 135px; }
    .axis-label.right { right: -150px; width: 135px; }
    .tab-button { padding: 21px 15px; font-size: 1.35rem; }
    .tab-content { padding: 30px; }
    #comparison-stack { width: 75%; }
}

@media (max-width: 900px) {
    .tabs { flex-direction: column; }
    .tab-button.active::after { display: none; }
    .tab-button { border-bottom: 2px solid #e2e8f0; }
    .legend-container { flex-direction: column; align-items: flex-start; padding-left: 60px; }
}
