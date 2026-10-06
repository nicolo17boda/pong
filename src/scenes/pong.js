const BIANCO = "0xFFFFFF";
const L_RACCHETTA = 20;
const A_RACCHETTA = 120;
const L_PALLINA= 24;
const MARGINE = 40;
const VEL_RACCHETTA = 8;

const TASTO_SU_SX = PP.key_codes.W;
const TASTO_GIU_SX = PP.key_codes.S;
const TASTO_SU_DX = PP.key_codes.UP;
const TASTO_GIU_DX = PP.key_codes.DOWN;

let racchetta_sx;
let racchetta_dx;
let pallina;

let vel_x = 6;
let vel_y = 4;

let punti_sx = 0;
let punti_dx = 0;

let testo_punti;

let img_sfondo;
let img_racchetta;
let img_pallina;

function preload(s) {
    img_sfondo = PP.assets.image.load(s, "assets/sfondo.png");
    img_racchetta = PP.assets.image.load(s, "assets/racchetta.png");
    img_pallina = PP.assets.image.load(s, "assets/pallina.png");
}

function create(s) {
    PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0);

    racchetta_sx = PP.assets.image.add(s, img_racchetta, MARGINE, ALTEZZA / 2, 0.5, 0.5);
    racchetta_dx = PP.assets.image.add(s, img_racchetta, LARGHEZZA - MARGINE, ALTEZZA / 2, 0.5, 0.5);

    racchetta_dx.geometry.flip_x = true;

    pallina = PP.assets.image.add(s, img_pallina, LARGHEZZA / 2, ALTEZZA / 2, 0.5, 0.5);

    punti_sx = 0;
    punti_dx = 0;
    vel_x = 6;
    vel_y = 4;
    testo_punti = PP.shapes.text_styled_add(s, LARGHEZZA / 2, 30,
        "0-0", 48, "Arial", "bold", BIANCO, null, 0.5, 0);
}

function muovi_pallina() {
    pallina.geometry.x += vel_x;
    pallina.geometry.y += vel_y;

    if (tocca(racchetta_dx) && vel_x > 0) {
        vel_x = - vel_x;
    }
    if (tocca(racchetta_sx) && vel_x < 0) {
        vel_x = - vel_x;
    }
    const meta = L_PALLINA / 2;
    if (pallina.geometry.y >= ALTEZZA - meta && vel_y > 0) {
        pallina.geometry.y = ALTEZZA - meta;
        vel_y = -vel_y;
    }
    if (pallina.geometry.y <= meta && vel_y < 0) {
        pallina.geometry.y = meta;
        vel_y = -vel_y;
    }
}

function controlla_punto() {
    const x = pallina.geometry.x;
    if (x >= 0 && x <= LARGHEZZA) {
        return;
    }

    if (x < 0) {
        punti_dx += 1;
    } else {
        punti_sx += 1;
    }

    pallina.geometry.x = LARGHEZZA / 2;
    pallina.geometry.y = ALTEZZA / 2;
    vel_x = x < 0 ? -6 : 6;
    vel_y = 4;
    PP.shapes.text_change(testo_punti, punti_sx + "-" + punti_dx);
}

function muovi_racchetta(s, racchetta, tasto_su, tasto_giu) {
    if (PP.interactive.kb.is_key_down(s, tasto_giu)) {
        racchetta.geometry.y += VEL_RACCHETTA;
    }
    if (PP.interactive.kb.is_key_down(s, tasto_su)) {
        racchetta.geometry.y -= VEL_RACCHETTA;
    }

    const meta = A_RACCHETTA / 2;
    racchetta.geometry.y = Math.max(meta,
        Math.min(ALTEZZA - meta, racchetta.geometry.y));
}

function tocca(racchetta) {
    let sinistra = racchetta.geometry.x - L_RACCHETTA / 2;
    let destra = racchetta.geometry.x + L_RACCHETTA / 2;
    let sopra = racchetta.geometry.y - A_RACCHETTA / 2;
    let sotto = racchetta.geometry.y + A_RACCHETTA / 2;

    let meta = L_PALLINA / 2;
    let x = pallina.geometry.x;
    let y = pallina.geometry.y;

    if (x + meta > sinistra && x - meta < destra && y + meta > sopra && y - meta < sotto) {
        return true;
    } else {
        return false;
    }
} 

function update(s) {
    muovi_racchetta(s, racchetta_sx, TASTO_SU_SX, TASTO_GIU_SX);
    muovi_racchetta(s, racchetta_dx, TASTO_SU_DX, TASTO_GIU_DX);
    muovi_pallina();
    controlla_punto();
}

function destroy(s) {

}

PP.scenes.add("pong",
preload, create, update, destroy);