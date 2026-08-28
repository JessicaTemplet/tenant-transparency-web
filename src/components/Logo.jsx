import React, { useEffect, useRef } from 'react';

// Animated canvas wordmark (house collapses into "TENANT" / "TRANSPARENCY").
// Ported 1:1 from the original vanilla-JS build (v32.html) — same constants,
// function names, and phase timings, so the math and animation stay identical.
//
// className controls the DISPLAYED size (matches how the old <img className="brand-logo" />
// / <img className="footer-logo" /> worked) — the canvas keeps its native 660x300
// internal resolution via the width/height attributes below so the drawing math
// never has to change, only the CSS scales it down.
const Logo = ({ className = 'brand-logo' }) => {
    const canvasRef = useRef(null);
    const rafIdRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        const NAVY = '#0B2265';
        const ORANGE = '#C83803';

        const FONT_SIZE = 28;
        const FONT_WEIGHT = '700';
        const FONT_SPACING = 3;
        const FONT_STR = `${FONT_WEIGHT} ${FONT_SIZE}px Georgia, 'Times New Roman', serif`;

        const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const clamp = (t) => Math.max(0, Math.min(1, t));
        const rng = (t, a, b) => clamp((t - a) / (b - a));
        const lerp = (a, b, t) => a + (b - a) * t;

        const measureWord = (text) => {
            ctx.font = FONT_STR;
            let w = 0;
            for (let i = 0; i < text.length; i++) {
                w += ctx.measureText(text[i]).width;
                if (i < text.length - 1) w += FONT_SPACING;
            }
            return w;
        };

        const drawChars = (text, x, y, alpha, n) => {
            const count = n === undefined ? text.length : Math.min(n, text.length);
            if (count <= 0 || alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = clamp(alpha);
            ctx.font = FONT_STR;
            ctx.fillStyle = NAVY;
            ctx.textBaseline = 'alphabetic';
            let cx = x;
            for (let i = 0; i < count; i++) {
                ctx.fillText(text[i], cx, y);
                cx += ctx.measureText(text[i]).width + (i < text.length - 1 ? FONT_SPACING : 0);
            }
            ctx.restore();
        };

        const drawTypewriter = (text, x, y, T, tStart, tEnd) => {
            const n = text.length;
            if (n === 0) return;
            const step = (tEnd - tStart) / n;
            const charDur = step * 1.7;
            ctx.save();
            ctx.font = FONT_STR;
            ctx.fillStyle = NAVY;
            ctx.textBaseline = 'alphabetic';
            let cx = x;
            for (let i = 0; i < n; i++) {
                const cStart = tStart + i * step;
                const a = ease(rng(T, cStart, cStart + charDur));
                if (a > 0) {
                    ctx.globalAlpha = a;
                    ctx.fillText(text[i], cx, y);
                }
                cx += ctx.measureText(text[i]).width + (i < n - 1 ? FONT_SPACING : 0);
            }
            ctx.restore();
        };

        const strokeT = (cx, topY, Tw, stemH, sw, alpha) => {
            if (alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = clamp(alpha);
            ctx.strokeStyle = ORANGE;
            ctx.lineWidth = sw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - Tw / 2, topY);
            ctx.lineTo(cx + Tw / 2, topY);
            ctx.moveTo(cx, topY);
            ctx.lineTo(cx, topY + stemH);
            ctx.stroke();
            ctx.restore();
        };

        const sline = (x1, y1, x2, y2, lw, alpha) => {
            if ((alpha ?? 1) <= 0) return;
            ctx.save();
            ctx.globalAlpha = clamp(alpha ?? 1);
            ctx.strokeStyle = ORANGE;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        };

        const drawHouse = (lx, rx, eaveY, botY, peakX, peakY, sw, alpha) => {
            if (alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = clamp(alpha);
            ctx.strokeStyle = ORANGE;
            ctx.lineWidth = sw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 10;
            ctx.beginPath();
            ctx.moveTo(lx, botY);
            ctx.lineTo(lx, eaveY);
            ctx.lineTo(peakX, peakY);
            ctx.lineTo(rx, eaveY);
            ctx.lineTo(rx, botY);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };

        const drawDoor = (lx, rx, botY, sw, alpha) => {
            if (alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = clamp(alpha);
            ctx.fillStyle = ORANGE;
            const houseWidth = rx - lx;
            const doorW = houseWidth * 0.16;
            const doorH = doorW * 1.8;
            const doorX = (lx + rx) / 2 - doorW / 2;
            const doorY = botY - doorH;
            ctx.fillRect(doorX, doorY, doorW, doorH);
            ctx.restore();
        };

        let L = null;
        const computeLayout = () => {
            ctx.font = FONT_STR;
            const tenantW = measureWord('TENANT');
            const transW = measureWord('TRANSPARENCY');
            const Tw = ctx.measureText('T').width;
            const capH = FONT_SIZE * 0.72;
            const stemH = capH * 1.25;
            const sw = FONT_SIZE * 0.11;
            const rowGap = FONT_SIZE * 1.55;
            const blockLeft = (W - transW) / 2;
            const T1_x = blockLeft + (transW - tenantW) / 2;
            const T2_x = blockLeft;
            const T1_cx = T1_x + Tw / 2;
            const T2_cx = T2_x + Tw / 2;
            const T1_baseY = H / 2 - rowGap / 2 - 20;
            const T2_baseY = T1_baseY + rowGap;
            const T1_topY = T1_baseY - capH;
            const T2_topY = T2_baseY - capH;
            const pad = 24;
            const hL = blockLeft - pad;
            const hR = blockLeft + transW + pad;
            const hBot = T2_baseY + pad * 1.5;
            const hEave = T1_topY - pad * 0.5;
            const hPeakX = (hL + hR) / 2;
            const hPeakY = Math.max(16, hEave - (hR - hL) * 0.16);
            return { tenantW, transW, Tw, capH, stemH, sw, rowGap, T1_x, T2_x, T1_baseY, T2_baseY, T1_topY, T2_topY, T1_cx, T2_cx, hL, hR, hBot, hEave, hPeakX, hPeakY };
        };

        const draw = (ts) => {
            if (!startTimeRef.current) startTimeRef.current = ts;
            const T = (ts - startTimeRef.current) / 1000;
            if (!L) L = computeLayout();
            ctx.clearRect(0, 0, W, H);

            const { Tw, capH, stemH, sw, T1_x, T2_x, T1_baseY, T2_baseY, T1_topY, T2_topY, T1_cx, T2_cx, hL, hR, hBot, hEave, hPeakX, hPeakY } = L;

            if (T < 1.60) {
                drawHouse(hL, hR, hEave, hBot, hPeakX, hPeakY, 4, 1);
                drawDoor(hL, hR, hBot, 4, 1);
            }

            const rotP = ease(rng(T, 1.60, 2.40));
            const wallP = ease(rng(T, 1.90, 2.45));
            if (T >= 1.60 && T < 2.85) {
                const midCX = (T1_cx + T2_cx) / 2;
                const apexX = lerp(hPeakX, midCX, rotP);
                const apexY = lerp(hPeakY, T1_topY, rotP);
                const lEndX = lerp(hL, T2_cx - Tw / 2, rotP);
                const lEndY = lerp(hEave, T1_topY, rotP);
                const rEndX = lerp(hR, T1_cx + Tw / 2, rotP);
                const rEndY = lerp(hEave, T1_topY, rotP);

                ctx.save();
                ctx.strokeStyle = ORANGE;
                ctx.lineWidth = sw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(lEndX, lEndY);
                ctx.lineTo(apexX, apexY);
                ctx.lineTo(rEndX, rEndY);
                ctx.stroke();
                ctx.restore();

                const lWallX = lerp(hL, T2_cx, wallP);
                sline(lWallX, T1_topY, lWallX, T1_topY + stemH, sw, 1);
                const rWallX = lerp(hR, T1_cx, wallP);
                sline(rWallX, T1_topY, rWallX, T1_topY + stemH, sw, 1);
                sline(hL, hBot, hR, hBot, 4, 1 - ease(rng(T, 1.60, 2.05)));
                drawDoor(hL, hR, hBot, 4, 1 - ease(rng(T, 1.60, 2.05)));
            }

            if (T >= 2.40) {
                const dropP = ease(rng(T, 2.85, 3.55));
                const t2Y = lerp(T1_topY, T2_topY, dropP);
                const t1sA = 1 - ease(rng(T, 3.65, 3.95));
                strokeT(T1_cx, T1_topY, Tw, stemH, sw, t1sA);
                const t2sA = 1 - ease(rng(T, 4.60, 4.90));
                strokeT(T2_cx, t2Y, Tw, stemH, sw, t2sA);
            }

            if (T >= 5.75) {
                const doorAlpha = easeOut(rng(T, 5.75, 6.55)) * 0.28;
                drawDoor(hL, hR, hBot, 4, doorAlpha);
            }

            const fontT1A = ease(rng(T, 3.65, 3.95));
            if (fontT1A > 0) drawChars('T', T1_x, T1_baseY, fontT1A);

            if (T >= 3.95) {
                drawChars('T', T1_x, T1_baseY, 1);
                ctx.font = FONT_STR;
                const afterT = T1_x + ctx.measureText('T').width + FONT_SPACING;
                drawTypewriter('ENANT', afterT, T1_baseY, T, 3.95, 4.60);
            }

            const fontT2A = ease(rng(T, 4.60, 4.90));
            if (fontT2A > 0) drawChars('T', T2_x, T2_baseY, fontT2A);

            if (T >= 4.90) {
                drawChars('T', T2_x, T2_baseY, 1);
                ctx.font = FONT_STR;
                const afterT = T2_x + ctx.measureText('T').width + FONT_SPACING;
                drawTypewriter('RANSPARENCY', afterT, T2_baseY, T, 4.90, 5.75);
            }

            if (T >= 5.75) {
                const finalAlpha = easeOut(rng(T, 5.75, 6.55));
                drawHouse(hL, hR, hEave, hBot, hPeakX, hPeakY, 4, finalAlpha);
            }

            if (T < 7.05) {
                rafIdRef.current = requestAnimationFrame(draw);
            }
        };

        const initAnimation = () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            startTimeRef.current = null;
            L = null;
            ctx.clearRect(0, 0, W, H);
            rafIdRef.current = requestAnimationFrame(draw);
        };
        initAnimation();
        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={660}
            height={300}
            className={className}
            role="img"
            aria-label="Tenant Transparency — Know Before You Lease"
        />
    );
};

export default Logo;
