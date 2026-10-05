/* source cote-amour ac80c36 */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  if (window.customElements && window.customElements.get('guide-coureur')) return;

  function escAttr(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isSafeUrl(u, fallback) {
    fallback = arguments.length > 1 ? fallback : '';
    if (u == null) return fallback;
    var s = String(u).replace(/[\u0000-\u001F\u007F]/g, '').trim();
    if (!s) return fallback;
    var m = s.match(/^wix:image:\/\/v1\/([^/#?]+)/i);
    if (m) s = 'https://static.wixstatic.com/media/' + m[1];
    else if ((m = s.match(/^wix:vector:\/\/v1\/([^/#?]+)/i))) s = 'https://static.wixstatic.com/shapes/' + m[1];
    var okScheme = /^(https?:|mailto:|tel:)/i.test(s);
    var relative = /^(\/|#|\?|\.\/|\.\.\/)/.test(s) || !/^[a-z][a-z0-9+.\-]*:/i.test(s);
    if (!okScheme && !relative) return fallback;
    return s.replace(/"/g, '%22').replace(/'/g, '%27');
  }

  function sized(u, w) {
    var m = String(u == null ? '' : u).match(/^https:\/\/static\.wixstatic\.com\/media\/([^/?#]+\.(?:jpe?g|png|webp))$/i);
    if (!m) return u;
    return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + (w * 2) + ',q_85,enc_auto/' + m[1];
  }

  function rt(v) {
    if (typeof v !== 'string' || v.indexOf('<') === -1) return v == null ? '' : String(v);
    return v.replace(/\sclass=("[^"]*"|'[^']*')/gi, function (m, raw) {
      var keep = raw.slice(1, -1).split(/\s+/).filter(function (c) {
        return c && !/^(font_\d+|color_\d+|wixui-[\w-]+|wixGuard)$/.test(c);
      }).join(' ');
      return keep ? ' class="' + keep + '"' : '';
    }).replace(/\sstyle=("[^"]*"|'[^']*')/gi, '');
  }

  function isEmpty(v) {
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'string') return !v.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim() && v.indexOf('<img') === -1;
    return false;
  }

  var NB = String.fromCharCode(0xA0), NNB = String.fromCharCode(0x202F);
  function typo(s) {
    return String(s == null ? '' : s)
      .replace(/(\d) (\d{3})(?!\d)/g, '$1' + NB + '$2')
      .replace(/(\d) (km|m|min|h|ans|cm|€|%)(?![A-Za-zÀ-ÿ])/g, '$1' + NB + '$2')
      .replace(/ ([:;!?»])/g, NNB + '$1')
      .replace(/« /g, '«' + NNB);
  }
  function tx(s) { return typo(escAttr(s)); }
  function rx(s) { return typo(rt(s)); }

  var UF = 'https://static.wixstatic.com/ufonts/106523_';
  function face(w, id) {
    return '@font-face{font-family:"gc-roboto";font-style:normal;font-weight:' + w + ';font-display:swap;src:url(' + UF + id + '/woff2/file.woff2) format("woff2"),url(' + UF + id + '/woff/file.woff) format("woff")}';
  }
  var FONTS = face(400, '1976ef4edbf44111abd4bd57d1e3e8f4') + face(700, '044bf68ddba3463fa1871befb02edccf') + face(900, '703a031aff9e414b8887521a867cbe71');

  var STORE_COURSE = 'mica-guide-course';

  var DICT = {
    fr: {
      brand: 'Guide du coureur',
      brandSub: 'Marathon Côte d\'Amour',
      navLabel: 'Sommaire du guide du coureur',
      navPrec: 'Onglets précédents',
      navSuiv: 'Onglets suivants',
      secProgramme: 'Programme',
      secVenir: 'Venir',
      secAvant: 'Avant la course',
      secJour: 'Jour de course',
      secRegles: 'Règles',
      secInfos: 'Infos pratiques',
      secApres: 'Après la course',
      secBenevoles: 'Bénévoles',
      secSupporters: 'Supporters',
      tProgramme: 'Programme du week‑end',
      tVenir: 'Venir sur l\'événement',
      tAvant: 'Avant la course',
      tJour: 'Jour de course',
      tRegles: 'Règles de course',
      tInfos: 'Infos pratiques',
      tApres: 'Après la course',
      tBenevoles: 'Bénévoles',
      tSupporters: 'Supporters',
      tPartenaires: 'Partenaires',
      heroProg: 'Voir le programme',
      heroRace: 'Choisir ma course',
      daysLeft: 'jours avant les premiers départs',
      dayLeft: 'jour avant les premiers départs',
      raceWeek: 'C\'est le week-end de course !',
      retrait: 'Retrait des dossards',
      jours: 'Jours du programme',
      itineraire: 'Itinéraire',
      adresses: 'Les adresses à retenir',
      parkings: 'Parkings recommandés',
      circulation: 'Infos circulation',
      aPied: 'à pied',
      lieuHoraires: 'Lieu et horaires',
      affluence: 'Horaires d\'affluence',
      affluenceIntro: 'Choisissez le meilleur moment pour venir retirer votre dossard !',
      n1: 'Calme',
      n2: 'Modéré',
      n3: 'Forte affluence',
      documents: 'Documents à présenter lors du retrait',
      espaceCoureur: 'Mon espace coureur',
      galopades: 'Galopades',
      rappel: 'Rappel important',
      lots: 'Lots participants',
      lotsIntro: 'À récupérer lors de votre venue sur le Village Marathon.',
      faq: 'Questions fréquentes',
      exposants: 'Les exposants',
      subRetrait: 'Retrait des dossards',
      subVillage: 'Village Marathon',
      jourIntro: 'Choisissez votre course pour afficher ses horaires, son lieu de départ, sa zone de SAS et ses consignes.',
      choisir: 'Choisir ma course',
      carte: 'Voir le parcours sur la carte interactive',
      bientot: 'Carte interactive bientôt disponible',
      departs: 'Les départs',
      materiel: 'Matériel',
      consignes: 'Consignes',
      ouverture: 'Ouverture à',
      zoneDepart: 'Zone de départ du',
      fermeture: 'Fermeture des SAS',
      fermetureElite: 'SAS Élites / Préférentiels',
      departLbl: 'Départ',
      anticipez: 'Pensez à anticiper votre arrivée !',
      meneurs: 'Meneurs d\'allure',
      meneursIntro: 'Des meneurs d\'allure seront présents pour vous accompagner sur les objectifs suivants.',
      plan: 'Plan d\'accès aux SAS',
      agrandir: 'Agrandir le plan',
      ouvrirImage: 'Ouvrir l\'image en grand',
      fermer: 'Fermer',
      reglement: 'Règlement',
      reglementTxt: 'Lisez le règlement de l\'événement.',
      reglementBtn: 'Lire le règlement',
      disqualif: 'Motifs de disqualification',
      tempsLimites: 'Temps limites',
      tempsIntro: 'Le temps maximum autorisé pour terminer chaque épreuve est de :',
      allureMini: 'Vélo balai à',
      protocole: 'Protocole de remise des prix',
      podiums: 'Horaires des podiums',
      devenir: 'Devenir bénévole',
      fanzones: 'Où sont les Fan Zones ?',
      top: 'Revenir en haut',
      loading: 'Chargement du guide du coureur'
    }
  };

  var SECTIONS = [
    { id: 'gc-programme', k: 'secProgramme', i: 'calendar' },
    { id: 'gc-venir', k: 'secVenir', i: 'pin' },
    { id: 'gc-avant', k: 'secAvant', i: 'ticket' },
    { id: 'gc-jour', k: 'secJour', i: 'flag' },
    { id: 'gc-regles', k: 'secRegles', i: 'doc' },
    { id: 'gc-infos', k: 'secInfos', i: 'info' },
    { id: 'gc-apres', k: 'secApres', i: 'medal' },
    { id: 'gc-benevoles', k: 'secBenevoles', i: 'heart' },
    { id: 'gc-supporters', k: 'secSupporters', i: 'users' }
  ];

  var SY = '<symbol viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="gci-';
  var ICONS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    SY + 'calendar"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></symbol>' +
    SY + 'pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>' +
    SY + 'ticket"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M9 6v12" stroke-dasharray="2 2.5"/></symbol>' +
    SY + 'flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></symbol>' +
    SY + 'doc"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></symbol>' +
    SY + 'info"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></symbol>' +
    SY + 'medal"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></symbol>' +
    SY + 'heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></symbol>' +
    SY + 'users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>' +
    SY + 'arrow"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>' +
    SY + 'chev"><polyline points="6 9 12 15 18 9"/></symbol>' +
    SY + 'up"><polyline points="18 15 12 9 6 15"/></symbol>' +
    SY + 'x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>' +
    SY + 'zoom"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></symbol>' +
    SY + 'ext"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></symbol>' +
    SY + 'nav"><polygon points="3 11 22 2 13 21 11 13 3 11"/></symbol>' +
    SY + 'park"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/></symbol>' +
    SY + 'bag"><path d="M6 8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/><path d="M9.5 5V3.5h5V5"/><path d="M9 14h6v4H9z"/></symbol>' +
    SY + 'train"><rect x="5" y="3" width="14" height="14" rx="3"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="12" y1="3" x2="12" y2="10"/><path d="M8 21l2-4M16 21l-2-4"/></symbol>' +
    SY + 'alert"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></symbol>' +
    SY + 'check"><polyline points="20 6 9 17 4 12"/></symbol>' +
    SY + 'ban"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></symbol>' +
    SY + 'clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>' +
    SY + 'timer"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/></symbol>' +
    SY + 'drop"><path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.3 0z"/></symbol>' +
    SY + 'map"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></symbol>' +
    SY + 'camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></symbol>' +
    SY + 'mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></symbol>' +
    SY + 'flash"><path d="M9 2h6v6l2 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-3z"/><line x1="12" y1="13" x2="12" y2="16"/></symbol>' +
    SY + 'live"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></symbol>' +
    '</svg>';
  function ic(id, cls) { return '<svg class="' + (cls || 'gc-ic') + '" aria-hidden="true" focusable="false"><use href="#gci-' + id + '"/></svg>'; }

  var LIEU_GJ = 'Complexe sportif Jean Gaillardon, Les Salines, La Baule';
  var LIEU_GUE = 'Cité médiévale de Guérande, boulevard du Midi';
  var LIEU_DEP = 'Promenade de mer de La Baule, boulevard du Docteur René Dubois';
  var LIEU_ARR = 'Esplanade Lucien Barrière, La Baule';

  var DEF = {
    heroKicker: '3<sup>e</sup> édition · 7 & 8 novembre 2026',
    heroTitre: 'Guide du coureur',
    heroAnnee: '2026',
    heroIntro: 'Toutes les informations pour vivre votre week-end sur la Presqu\'île guérandaise, du retrait des dossards à la ligne d\'arrivée.',
    heroImage: 'https://static.wixstatic.com/media/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg',
    heroImagePos: '50% 35%',
    motif: 'https://static.wixstatic.com/media/df962b_7f4d7d796769416482a10eced7bf1762~mv2.jpg',
    premierDepart: '2026-11-07T16:30:00+01:00',
    finWeekend: '2026-11-08T18:00:00+01:00',
    courseDefaut: 'marathon',
    jourDefaut: 1,
    liens: {
      carte: '',
      reglement: '/rules',
      benevoles: '/volunteers',
      circulation: '/circulation',
      resultats: '/resultats',
      espaceCoureur: 'https://in.njuko.com/marathon-international-de-la-cote-damour-amarris-20261765967676928/my-registration'
    },

    programme: [
      { jour: 'Vendredi 6 novembre', court: 'Ven. 6 nov.', date: '2026-11-06', items: [
        { h: '15h00 à 20h00', t: 'Retrait des dossards', l: LIEU_GJ }
      ] },
      { jour: 'Samedi 7 novembre', court: 'Sam. 7 nov.', date: '2026-11-07', items: [
        { h: '9h00', t: 'Départ Breakfast Run pour semi-marathoniens et marathoniens', note: 'Sur inscription', l: 'Depuis le Village Marathon, La Baule' },
        { h: '10h00 à 19h00', t: 'Retrait des dossards', l: LIEU_GJ },
        { h: '14h00', t: 'Présentation du plateau Élites', l: LIEU_GJ },
        { h: '15h00', t: 'Présentation des meneurs d\'allure', l: LIEU_GJ },
        { h: '16h30', t: 'Départ Galopades 7 à 9 ans', l: LIEU_GUE, fort: true },
        { h: '16h45', t: 'Départ Galopades 10 à 11 ans', l: LIEU_GUE, fort: true },
        { h: '17h15', t: 'Départ Galopades 12 à 13 ans', l: LIEU_GUE, fort: true },
        { h: '18h15', t: 'Départ du 5 km', l: LIEU_GUE, fort: true },
        { h: '20h00', t: 'Départ du 10 km', l: LIEU_GUE, fort: true },
        { h: '20h45', t: 'Remise des prix du 10 km', l: LIEU_GUE }
      ] },
      { jour: 'Dimanche 8 novembre', court: 'Dim. 8 nov.', date: '2026-11-08', items: [
        { h: '7h15', t: 'Ouverture des consignes', l: 'Esplanade François André, La Baule' },
        { h: '8h30', t: 'Départ du Semi-Marathon', l: LIEU_DEP, fort: true },
        { h: '9h15', t: 'Départ du Marathon', l: LIEU_DEP, fort: true },
        { h: '10h00', t: 'Remise des prix du Semi-Marathon', l: LIEU_ARR },
        { h: '11h40', t: 'Remise des prix du Marathon individuel', l: LIEU_ARR }
      ] }
    ],

    venirIntro: 'Du vendredi 6 au dimanche 8 novembre, la Presqu\'île guérandaise vibrera au rythme des épreuves du Marathon International de la Côte d\'Amour Amarris. Voici les principales adresses à retenir.',
    adresses: [
      { t: 'Village et retrait des dossards', l: 'Complexe sportif Jean Gaillardon, Les Salines', v: 'La Baule', q: 'Complexe sportif Jean Gaillardon, La Baule', i: 'ticket' },
      { t: 'Départ et arrivée du 5 km et du 10 km', l: 'Boulevard du Midi', v: 'Guérande', q: 'Boulevard du Midi, Guérande', i: 'flag' },
      { t: 'Départ du semi-marathon et du marathon', l: 'Boulevard du Docteur René Dubois', v: 'La Baule', q: 'Boulevard René Dubois, La Baule', i: 'flag' },
      { t: 'Arrivée du semi-marathon et du marathon', l: 'Esplanade Lucien Barrière', v: 'La Baule', q: 'Esplanade Lucien Barrière, La Baule', i: 'medal' },
      { t: 'Fan Zones Amarris', lignes: ['<strong>Samedi</strong> : boulevard de Dinkelsbühl, Guérande', '<strong>Dimanche</strong> : quai Sandeau, Le Pouliguen'], i: 'users' }
    ],
    circulationAlerte: 'La circulation sera <strong>fortement perturbée sur l\'ensemble de la Presqu\'île le dimanche 8 novembre, de 8h00 à 15h00</strong>. Les vélos ne seront pas autorisés sur le parcours et la circulation automobile sera très restreinte. Nous vous recommandons donc d\'anticiper vos déplacements ainsi que ceux de vos accompagnants afin de profiter pleinement de l\'événement dans les meilleures conditions.',
    circulationConseil: 'En raison de la forte affluence sur l\'événement, nous vous conseillons d\'anticiper tous vos déplacements sur la Presqu\'île durant le week-end, de vous stationner en périphérie et de privilégier le covoiturage.',
    parkings: [
      { jour: 'Samedi à Guérande', items: [
        { n: 'Parking Aquaguérande', d: [{ k: 'depart', dist: '1,2 km', z: 'de la zone de départ et d\'arrivée', min: '18 min' }] },
        { n: 'Parking du Centre sportif Kerbiniou', d: [{ k: 'depart', dist: '1,2 km', z: 'de la zone de départ et d\'arrivée', min: '18 min' }] },
        { n: 'Parking Ciné Presqu\'île', d: [{ k: 'depart', dist: '850 m', z: 'de la zone de départ et d\'arrivée', min: '12 min' }] }
      ] },
      { jour: 'Dimanche à La Baule', items: [
        { n: 'Parking des Salines', d: [{ k: 'depart', dist: '1,7 km', z: 'de la zone de départ', min: '25 min' }, { k: 'arrivee', dist: '1,3 km', z: 'de la zone d\'arrivée et des consignes', min: '18 min' }] },
        { n: 'Parking 1, gare de La Baule-Escoublac', d: [{ k: 'depart', dist: '1,6 km', z: 'de la zone de départ', min: '22 min' }, { k: 'arrivee', dist: '1,5 km', z: 'de la zone d\'arrivée et des consignes', min: '20 min' }] },
        { n: 'Parking Agen', d: [{ k: 'depart', dist: '2 km', z: 'de la zone de départ', min: '30 min' }, { k: 'arrivee', dist: '1 km', z: 'de la zone d\'arrivée et des consignes', min: '15 min' }] }
      ] }
    ],
    ter: {
      titre: 'Venez en TER pour 5 € le trajet',
      texte: 'La Région Pays de la Loire et SNCF TER proposent un <strong>billet à 5 € le trajet</strong> au départ ou à destination de <strong>La Baule-Escoublac</strong>, depuis les gares des Pays de la Loire et certaines gares limitrophes.',
      points: [
        { i: 'calendar', t: 'Billets disponibles <strong>un mois avant l\'événement</strong>' },
        { i: 'alert', t: 'Une <strong>confirmation de participation à la course</strong> devra être présentée lors du contrôle' }
      ]
    },

    retrait: {
      lieu: 'Complexe sportif Jean Gaillardon, Les Salines',
      ville: '44500 La Baule',
      q: 'Complexe sportif Jean Gaillardon, La Baule',
      horaires: [{ j: 'Vendredi 6 novembre', h: '15h00 à 20h00' }, { j: 'Samedi 7 novembre', h: '10h00 à 19h00' }],
      alerte: 'Aucun dossard ne sera remis en dehors de ces horaires, ni le dimanche 8 novembre, ni envoyé par La Poste.',
      documents: [
        'Votre <strong>pièce d\'identité</strong>',
        'Votre <strong>carte de retrait</strong>, au format numérique de préférence',
        'Si votre dossier est incomplet : votre <strong>PPS</strong> ou votre <strong>licence FFA</strong>'
      ],
      galopades: 'Pour les courses enfants, le dossard devra obligatoirement être retiré par une personne majeure.',
      rappel: 'Les dossards sont strictement nominatifs. Les transferts réalisés en dehors du cadre officiel sont interdits. Tout transfert non autorisé entraînera la disqualification ainsi qu\'une interdiction de participation à l\'ensemble des épreuves de l\'événement pendant deux ans, tant pour le vendeur du dossard que pour le coureur concerné.',
      lots: [
        { i: '🎁', t: '<strong>Lot surprise</strong> local pour le 5 km et le 10 km' },
        { i: '👕', t: '<strong>T-shirt technique ou lot local</strong> pour le semi-marathon et le marathon, selon le choix fait lors de votre inscription' }
      ],
      faq: [
        { q: 'Comment faire si je ne peux pas venir retirer mon dossard ?', a: 'Votre dossard peut être retiré par un tiers sur présentation de votre carte de retrait ainsi que de votre carte d\'identité. Si votre dossier est incomplet, votre justificatif (PPS ou licence FFA) devra être présenté.' },
        { q: 'Quel document dois-je fournir pour valider mon dossier ?', a: '<p>Vous avez plusieurs possibilités pour compléter votre dossier :</p><ul><li>fournir un PPS valide (de moins de 3 mois), que vous pouvez obtenir sur <a href="https://pps.athle.fr/" target="_blank" rel="noopener">pps.athle.fr</a> ;</li><li>ou fournir une licence FFA avec la mention « en compétition ».</li></ul>' },
        { q: 'Comment retourner sur mon espace coureur pour valider mon dossier ?', a: '<p>Vous pouvez retourner sur votre espace coureur (pour modifier votre inscription ou déposer votre justificatif médical par exemple) grâce au lien présent dans l\'e-mail de confirmation d\'inscription.</p><p>Vous avez égaré votre code d\'inscription ou cet e-mail ? Pas de panique ! Rendez-vous sur <a href="https://in.njuko.com/marathon-international-de-la-cote-damour-amarris-20261765967676928/my-registration" target="_blank" rel="noopener">votre espace coureur</a>, puis choisissez « Code de réservation oublié » pour recevoir à nouveau votre e-mail de confirmation.</p>' }
      ]
    },
    affluence: [
      { j: 'Vendredi 6 novembre', c: [{ de: '15h', a: '16h', n: 3 }, { de: '16h', a: '17h', n: 1 }, { de: '17h', a: '18h', n: 2 }, { de: '18h', a: '19h', n: 3 }, { de: '19h', a: '20h', n: 2 }] },
      { j: 'Samedi 7 novembre', c: [{ de: '10h', a: '11h', n: 1 }, { de: '11h', a: '12h', n: 2 }, { de: '12h', a: '13h', n: 2 }, { de: '13h', a: '14h', n: 1 }, { de: '14h', a: '15h', n: 3 }, { de: '15h', a: '16h', n: 3 }, { de: '16h', a: '17h', n: 3 }, { de: '17h', a: '18h', n: 2 }, { de: '18h', a: '19h', n: 2 }] }
    ],
    village: {
      titre: 'Village Marathon',
      texte: 'Le Village Marathon accueille le retrait des dossards et les exposants, au complexe sportif Jean Gaillardon (Les Salines, La Baule).',
      exposants: []
    },
    boutique: {
      tag: 'Boutique officielle',
      titre: 'Emportez un souvenir de la 3<sup>e</sup> édition',
      texte: 'Transat, sweat zippé et affiches aux couleurs du Marathon Côte d\'Amour Amarris.',
      image: 'https://static.wixstatic.com/media/df962b_0009e9e95f0a4c68b8b33e9b5c5450dd~mv2.jpg',
      imageAlt: 'Boutique officielle du Marathon Côte d\'Amour Amarris : transat, sweat zippé et affiches',
      lien: '',
      bouton: 'Voir la boutique'
    },

    sasFaq: [
      { q: 'Comment connaître mon SAS de départ ?', a: 'Votre SAS est attribué en fonction de l\'objectif de temps renseigné lors de votre inscription. Il sera <strong>indiqué directement sur votre dossard</strong>.' },
      { q: 'Puis-je changer de SAS ?', a: '⛔ Non, aucun changement de SAS n\'est possible, ni avant l\'événement ni sur place. Vous pourrez toutefois <strong>rejoindre un SAS plus lent que celui qui vous a été attribué</strong>, mais jamais un SAS plus rapide.' }
    ],
    consignesCourse: {
      ouverture: '7h15',
      texte: 'Les consignes se situent <strong>au niveau de la ligne d\'arrivée</strong>, esplanade François André, à environ 1,5 km du départ (20 min à pied).',
      points: [
        '<strong>1 sac par personne</strong>, format maximum 46 × 37 cm',
        'Fixez sur votre sac l\'<strong>étiquette détachable</strong> présente sur votre dossard',
        'Un <strong>contrôle obligatoire des sacs</strong> est réalisé par du personnel habilité : un afflux important est possible'
      ]
    },
    courses: [
      { id: 'galopades', label: 'Galopades', heure: 'dès 16h30', jour: 'Samedi 7 novembre', titre: 'Les Galopades', sous: 'Courses enfants', de: 'Galopades',
        faits: [
          { i: 'pin', k: 'Lieu de départ et d\'arrivée', v: LIEU_GUE },
          { i: 'calendar', k: 'Date et heure de départ', v: 'Samedi 7 novembre à partir de 16h30' }
        ],
        departs: [
          { h: '16h30', t: '7 à 9 ans', d: '700 m', n: '1 boucle de 700 m' },
          { h: '16h45', t: '10 à 11 ans', d: '1 400 m', n: '2 boucles de 700 m' },
          { h: '17h15', t: '12 à 13 ans', d: '2 100 m', n: '3 boucles de 700 m' }
        ],
        note: 'Le dossard d\'un enfant doit obligatoirement être retiré par une personne majeure.'
      },
      { id: '5km', label: '5 km', heure: '18h15', jour: 'Samedi 7 novembre', titre: '5 km', sous: 'Départ et arrivée dans la Cité médiévale de Guérande', de: '5 km',
        faits: [
          { i: 'pin', k: 'Lieu de départ et d\'arrivée', v: LIEU_GUE },
          { i: 'calendar', k: 'Date et heure de départ', v: 'Samedi 7 novembre à 18h15' },
          { i: 'users', k: 'Nombre de participants', v: '1 000 participants' },
          { i: 'timer', k: 'Barrière horaire', v: '45 min après le départ, soit 19h00' },
          { i: 'drop', k: 'Ravitaillements', v: 'Liquide et solide à l\'arrivée' }
        ],
        materiel: 'Prévoyez une <strong>lampe de running</strong> (frontale ou pectorale) pour votre course.'
      },
      { id: '10km', label: '10 km', heure: '20h00', jour: 'Samedi 7 novembre', titre: '10 km', sous: 'Départ et arrivée dans la Cité médiévale de Guérande', de: '10 km',
        faits: [
          { i: 'pin', k: 'Lieu de départ et d\'arrivée', v: LIEU_GUE },
          { i: 'calendar', k: 'Date et heure de départ', v: 'Samedi 7 novembre à 20h00' },
          { i: 'users', k: 'Nombre de participants', v: '3 000 participants' },
          { i: 'timer', k: 'Barrière horaire', v: '1h30 après le départ, soit 21h30' },
          { i: 'drop', k: 'Ravitaillements', v: 'Liquide au km 5, liquide et solide à l\'arrivée' }
        ],
        materiel: 'Prévoyez une <strong>lampe de running</strong> (frontale ou pectorale) pour votre course.',
        sas: {
          intro: 'Pour le <strong>10 km</strong>, la zone de départ est organisée en plusieurs SAS. Votre SAS est défini en fonction de l\'objectif de temps renseigné lors de votre inscription.',
          elite: 'Un espace spécifique est réservé aux coureurs <strong>Élites et Préférentiels</strong>, à l\'avant de la zone de départ, suivi des différents SAS correspondant aux objectifs de temps.',
          plan: '',
          fermeture: '19h50', fermetureElite: '19h55', depart: '20h00',
          departNote: 'Un seul départ sera donné à 20h00 pour l\'ensemble des SAS.',
          meneurs: ['40 min', '45 min', '50 min', '55 min', '1h']
        }
      },
      { id: 'semi', label: 'Semi-marathon', heure: '8h30', jour: 'Dimanche 8 novembre', titre: 'Semi-marathon', sous: 'De la promenade de mer à l\'esplanade Lucien Barrière', de: 'semi-marathon',
        faits: [
          { i: 'pin', k: 'Lieu de départ', v: 'Boulevard du Docteur René Dubois, La Baule' },
          { i: 'flag', k: 'Lieu d\'arrivée', v: LIEU_ARR },
          { i: 'calendar', k: 'Date et heure de départ', v: 'Dimanche 8 novembre à 8h30' },
          { i: 'timer', k: 'Barrière horaire', v: 'Après 2h45 de course' },
          { i: 'users', k: 'Nombre de participants', v: '4 500 participants' },
          { i: 'drop', k: 'Ravitaillements', v: 'Tous les 5 km et à l\'arrivée' }
        ],
        consignes: true,
        sas: {
          intro: 'La zone de départ est organisée en <strong>plusieurs SAS</strong>. Votre placement est déterminé en fonction de l\'objectif de temps renseigné lors de votre inscription.',
          elite: 'Un SAS spécifique est réservé aux coureurs <strong>Élites et Préférentiels</strong>, à l\'avant de la zone de départ, suivi des différents SAS correspondant aux objectifs de temps.',
          plan: 'https://static.wixstatic.com/media/df962b_b9fbe38ff4814f9ab7044bf568cf78bd~mv2.jpg',
          fermeture: '8h20', fermetureElite: '8h25', depart: '8h30',
          departNote: 'Un seul départ sera donné, avec quelques minutes d\'intervalle entre chaque SAS afin de fluidifier le flux.',
          meneurs: ['1h30', '1h40', '1h45', '1h50', '2h', '2h10']
        }
      },
      { id: 'marathon', label: 'Marathon', heure: '9h15', jour: 'Dimanche 8 novembre', titre: 'Marathon', sous: 'De la promenade de mer à l\'esplanade Lucien Barrière', de: 'marathon',
        faits: [
          { i: 'pin', k: 'Lieu de départ', v: 'Boulevard du Docteur René Dubois, La Baule' },
          { i: 'flag', k: 'Lieu d\'arrivée', v: LIEU_ARR },
          { i: 'calendar', k: 'Date et heure de départ', v: 'Dimanche 8 novembre à 9h15' },
          { i: 'timer', k: 'Barrière horaire', v: 'Après 5h45 de course' },
          { i: 'users', k: 'Nombre de participants', v: '8 500 participants' },
          { i: 'drop', k: 'Ravitaillements', v: 'Tous les 5 km et à l\'arrivée' }
        ],
        consignes: true,
        sas: {
          intro: 'La zone de départ est organisée en <strong>plusieurs SAS</strong>. Votre placement est déterminé en fonction de l\'objectif de temps renseigné lors de votre inscription.',
          elite: 'Un SAS spécifique est réservé aux coureurs <strong>Élites et Préférentiels</strong>, à l\'avant de la zone de départ, suivi des différents SAS correspondant aux objectifs de temps.',
          plan: 'https://static.wixstatic.com/media/df962b_8f16cc6f5b144e7188d0943b059bf0e5~mv2.jpg',
          fermeture: '9h05', fermetureElite: '9h10', depart: '9h15',
          departNote: 'Un seul départ sera donné, avec quelques minutes d\'intervalle entre chaque SAS afin de fluidifier le flux.',
          meneurs: ['3h', '3h15', '3h30', '3h45', '4h', '4h15', '4h30']
        }
      }
    ],

    reglesIntro: 'Pour le bon déroulement de la course et la sécurité de tous, <strong>les comportements suivants entraîneront une disqualification</strong> :',
    disqualif: [
      'Courir avec le <strong>dossard d\'une autre personne</strong>',
      '<strong>Modifier ou découper</strong> son dossard',
      'Franchir la ligne d\'arrivée avec <strong>un accompagnant sans dossard</strong>, y compris un enfant',
      '<strong>Revenir sur le parcours</strong> après avoir franchi la ligne d\'arrivée',
      '<strong>Jeter ses déchets</strong> en dehors des zones dédiées',
      'Ne pas respecter les consignes de <strong>l\'organisation, des bénévoles, des juges, des forces de sécurité ou du personnel médical</strong>',
      'Adopter un <strong>comportement antisportif</strong>, notamment s\'il nuit aux autres coureurs',
      'Être <strong>accompagné à vélo</strong> par un proche sur le parcours',
      'Recevoir une <strong>assistance ou un ravitaillement extérieur</strong> sur le parcours'
    ],
    tempsLimites: [
      { c: '5 km', t: '45 min' },
      { c: '10 km', t: '1h30' },
      { c: 'Semi-marathon', t: '2h45', a: '7\'40/km' },
      { c: 'Marathon', t: '5h45', a: '8\'10/km' }
    ],
    veloBalai: 'Sur le <strong>semi-marathon et le marathon</strong>, un vélo balai suivra l\'allure minimale autorisée : <strong>7\'40/km</strong> sur le semi-marathon, <strong>8\'10/km</strong> sur le marathon.',
    horsDelai: '<p>Tout coureur dépassé par le vélo balai sera considéré <strong>hors délai et mis hors course</strong>.</p><p>À partir de ce moment, <strong>le dispositif de course est progressivement levé</strong> : la sécurisation du parcours n\'est plus assurée, les signaleurs et bénévoles quittent leur poste et les ravitaillements sont fermés, <strong>y compris celui situé à l\'arrivée</strong>.</p><p>Le coureur pourra poursuivre son parcours <strong>sous sa propre responsabilité</strong>, dans le respect du Code de la route, sans bénéficier des services et du dispositif mis en place par l\'organisation.</p>',

    infos: [
      { i: '🥤', t: 'Ravitaillements', c: 'Tous les 5 km environ et à l\'arrivée pour toutes les épreuves, vous trouverez de l\'eau en gobelet (plate ou gazeuse), du cola, des fruits frais, des fruits secs et des snacks salés. De la boisson électrolyte de la marque Tā Energy sera distribuée sur l\'ensemble des ravitaillements du semi-marathon et du marathon.' },
      { i: '🎒', t: 'Consignes', c: '<p>Uniquement pour le semi-marathon et le marathon, vous disposerez d\'un espace consignes gratuit pour déposer vos affaires personnelles sur la zone d\'arrivée, située esplanade François André (à 1,5 km du départ).</p><p>L\'espace consignes sera ouvert à partir de 7h15 le dimanche.</p>' },
      { i: '🚑', t: 'Assistance médicale', c: 'Des membres de la SNSM (Société nationale de sauvetage en mer) ainsi que 3 médecins urgentistes seront mobilisés pour assurer la sécurité des coureurs.' },
      { i: '✋', t: 'Bénévoles', c: 'Des bénévoles seront disponibles pour accueillir et informer les coureurs en cas de besoin. Ils seront 1 100 pour vous ravitailler, vous orienter et sécuriser les parcours.' },
      { i: '👕', t: 'Récupération de textiles', c: 'Le Secours populaire viendra récupérer les vêtements abandonnés par les coureurs sur la ligne de départ du semi-marathon et du marathon.' },
      { i: '♻️', t: 'Tri des déchets', c: 'Sur l\'ensemble de nos sites (Village Marathon, espace bénévoles, zones de ravitaillement), l\'organisation met en place des poubelles de tri sélectif : papier, PET, compostable, autres déchets. Cette initiative vise à valoriser les déchets et à réduire au maximum l\'impact environnemental sur notre terrain de jeu. Dans cette même démarche, les participants sont tenus de déposer leurs déchets dans les zones prévues à cet effet. Une « brigade verte » sera présente pour veiller au bon tri et au respect de ces consignes.' },
      { i: '💦', t: 'Douches', c: 'Des douches seront à votre disposition le dimanche, au stade Moreau-Defarges à La Baule (comptez 15 à 20 minutes de marche depuis l\'arrivée).' },
      { i: '🚻', t: 'Toilettes', c: 'Des toilettes seront à votre disposition sur les zones de départ et d\'arrivée de toutes les courses, ainsi que sur chaque point de ravitaillement (pour le semi-marathon et le marathon uniquement).' },
      { i: '🥇', t: 'Résultats', c: 'Les résultats seront en ligne sur <a href="/resultats">la page Résultats</a> du site de l\'événement dès la fin des épreuves.' },
      { i: '🔦', t: 'Matériel spécifique pour le 5 km et le 10 km', c: 'Prévoyez une lampe de running (frontale ou pectorale) pour votre course.' }
    ],

    apres: [
      { i: '🏅', t: 'Médaille et diplôme finisher', c: '<p>Les coureurs du <strong>marathon et du semi-marathon ayant choisi de recevoir la médaille</strong> lors de leur inscription auront un pictogramme 🏅 sur leur dossard. Elle leur sera remise après l\'arrivée.</p><p>Si vous avez choisi la <strong>plaque personnalisée</strong>, elle vous sera envoyée par courrier dans le mois suivant l\'événement, avec vos <strong>nom, prénom et temps réalisé</strong>.</p><p>Enfin, tous les participants pourront télécharger gratuitement leur <strong>diplôme finisher</strong> depuis <a href="/resultats">la page Résultats</a> du site après la course.</p>' },
      { i: '📸', t: 'Photos souvenirs', c: 'Quelle que soit la distance parcourue (hors courses enfants), retrouvez et achetez vos photos individuelles à partir du <strong>lundi 9 novembre</strong> en saisissant votre numéro de dossard sur <a href="https://www.marathondelacotedamour.com/">marathondelacotedamour.com</a> ou <a href="https://photorunning.com/" target="_blank" rel="noopener">photorunning.com</a>.' },
      { i: '🎁', t: 'Cadeau coureur', c: '<p>Chaque coureur se verra remettre son lot individuel lors du retrait des dossards sur le Village Marathon :</p><ul><li>un lot surprise local pour le 5 km et le 10 km ;</li><li>un t-shirt technique pour le semi-marathon et le marathon, ou un lot local pour celles et ceux qui ont préféré cette alternative lors de leur inscription, dans une démarche plus responsable.</li></ul>' }
    ],
    protocole: '<p>Les <strong>3 premiers et 3 premières du scratch</strong> du 10 km, du semi-marathon et du marathon se verront offrir un prix.</p><p>Le premier et la première du 5 km seront récompensés à la fin de l\'épreuve.</p>',
    podiums: [
      { jour: 'Samedi 7 novembre', items: [{ h: '20h45', t: '10 km' }], lieu: 'Cité médiévale de Guérande, boulevard du Midi (ligne d\'arrivée)' },
      { jour: 'Dimanche 8 novembre', items: [{ h: '10h00', t: 'Semi-marathon' }, { h: '11h40', t: 'Marathon individuel' }], lieu: 'Esplanade Lucien Barrière (ligne d\'arrivée)' }
    ],

    benevoles: {
      texte: '<p>Tout au long du week-end, nos bénévoles seront présents pour vous accueillir, vous orienter et vous accompagner : retrait des dossards, SAS de départ, sécurité sur les parcours, ravitaillements, consignes, arrivée…</p><p>Besoin d\'une information ou d\'aide ? N\'hésitez pas à vous tourner vers eux ! Et surtout, pensez à leur rendre leurs sourires et à faire preuve de bienveillance à leur égard. 💙</p><p>Et pour une prochaine édition, pourquoi ne pas vivre l\'aventure autrement en passant, vous aussi, du côté des bénévoles ? Découvrez toutes les missions et rejoignez-nous sur notre page Bénévoles.</p>',
      image: '',
      imageAlt: 'Les bénévoles du Marathon Côte d\'Amour Amarris',
      chiffre: '1 100',
      chiffreTexte: 'bénévoles pour vous ravitailler, vous orienter et sécuriser les parcours'
    },

    supportersIntro: 'Vous aussi, participez à l\'ambiance du Marathon International de la Côte d\'Amour Amarris ! Retrouvez les Fan Zones, suivez vos coureurs grâce au suivi live et consultez les informations de circulation pour organiser vos déplacements.',
    direct: {
      titre: 'Direct depuis la ligne d\'arrivée',
      texte: 'Vivez le Marathon au plus près de la course ! Depuis la ligne d\'arrivée, <strong>suivez en direct l\'évolution de la tête de course</strong> grâce à nos speakers embarqués sur les motos. Positions, écarts, temps forts… vous ne manquerez rien de la course avant de voir les premiers athlètes franchir la ligne d\'arrivée.'
    },
    conduiteTitre: 'Le code de bonne conduite du supporter',
    conduiteIntro: 'Être supporter, c\'est encourager, vibrer et partager la course… tout en veillant à la sécurité et au confort de tous. Quelques règles pour profiter pleinement de l\'événement :',
    conduite: [
      { i: '📍', t: 'Anticipez vos retrouvailles', c: 'Fixez un point de rendez-vous avec votre coureur avant la course. À l\'arrivée, les <strong>points A et B</strong>, matérialisés par de grands totems, faciliteront vos retrouvailles.' },
      { i: '👏', t: 'Privilégiez les Fan Zones Amarris pour encourager vos proches !', c: 'Pour profiter pleinement de l\'ambiance et soutenir votre coureur, <strong>rendez-vous dans les Fan Zones Amarris</strong> installées sur les parcours. Animations et encouragements seront au rendez-vous ! Consultez la carte interactive pour les localiser et organiser vos déplacements entre les différents points.' },
      { i: '👀', t: 'Rendez-vous visible… sans gêner', c: 'Pancarte, accessoire, signe distinctif : faites-vous remarquer de votre coureur, mais <strong>restez toujours en dehors de la chaussée et du parcours</strong>.' },
      { i: '🚫', t: 'Ne suivez pas votre coureur sur le parcours', c: 'Il est interdit d\'accompagner un participant <strong>à pied ou à vélo</strong>, même sur une courte distance. Cela peut entraîner sa disqualification.' },
      { i: '🏁', t: 'Laissez-lui sa ligne d\'arrivée', c: '<strong>N\'entrez pas dans la zone d\'arrivée et ne franchissez jamais la ligne avec votre coureur, y compris avec des enfants.</strong> Nous comprenons l\'envie de partager cet instant, mais ces zones restent sensibles, avec un flux continu de coureurs fatigués et des prises en charge médicales. Retrouvez-le plutôt à la sortie coureurs pour célébrer son exploit !' },
      { i: '💙', t: 'Respectez celles et ceux qui font vivre l\'événement', c: 'Respectez les consignes des bénévoles, signaleurs, agents de sécurité et membres de l\'organisation. <strong>Un sourire et un encouragement sont toujours les bienvenus !</strong>' }
    ],

    encarts: [
      { place: 'haut', format: 'bandeau', icone: 'map', tag: 'Carte interactive', titre: 'Plan général interactif', texte: 'Repérez les ravitaillements, découvrez les services proposés et retrouvez toutes les informations pratiques de votre course.', lien: '', bouton: 'Ouvrir la carte interactive', attente: 'Bientôt disponible' },
      { place: 'programme', format: 'edito', tag: 'Édito du partenaire titre de l\'événement', titre: 'Amarris', logo: 'https://static.wixstatic.com/media/df962b_9f0cf5e586ff40589cf69bf73ccd31e0~mv2.png', image: 'https://static.wixstatic.com/media/df962b_20c9928aafeb4824a317f1363cc71ff3~mv2.jpg', imagePos: '78% 30%', imageAlt: 'Claude Robin, président et fondateur d\'Amarris Groupe',
        texte: '<p>Chers coureurs,</p><p>C\'est avec plaisir qu\'Amarris s\'associe une nouvelle fois au Marathon International de la Côte d\'Amour Amarris.</p><p>Pour cette 3<sup>e</sup> édition, l\'engouement est plus fort que jamais : 17 000 coureurs s\'apprêtent à prendre le départ sur les 5 parcours du Marathon, chacun avec son objectif et son rythme. Parmi eux, 120 collaborateurs, clients et partenaires d\'Amarris. Une présence dont nous sommes particulièrement fiers !</p><p>Vibrer au rythme de cette aventure collective, partager vos émotions, c\'est ce qui nous anime au quotidien. Alors cette année encore, nous serons à vos côtés pour vous encourager.</p><p>Bonne course !</p>',
        signature: 'Claude Robin', fonction: 'Président & Fondateur, Amarris Groupe', lien: 'https://www.amarris.fr/', bouton: 'En savoir plus sur Amarris' },
      { place: 'venir', format: 'bandeau', tag: 'Partenaire titre', titre: 'Amarris', logo: 'https://static.wixstatic.com/media/df962b_9f0cf5e586ff40589cf69bf73ccd31e0~mv2.png', image: 'https://static.wixstatic.com/media/df962b_0245492ca5f14c679f1aeaeb086dac20~mv2.jpg', imagePos: '55% 50%', imageAlt: 'Deux coureurs sur la plage de La Baule',
        texte: 'Partageons nos émotions ! Amarris vous offre votre dossard pour l\'édition 2027.', lien: 'https://www.amarris.fr/event/marathon-international-cote-amour', bouton: 'Tentez votre chance' },
      { place: 'jour', format: 'bandeau', tag: 'Partenaire officiel', titre: 'Running Conseil', logo: 'https://static.wixstatic.com/media/df962b_0512af0338794ff69c43b5c56a624d5b~mv2.png', image: 'https://static.wixstatic.com/media/df962b_9d0c242fde5f4d39ad7b44563ded390f~mv2.jpg', imagePos: '62% 40%', imageAlt: 'Conseil chaussures dans un magasin Running Conseil',
        texte: 'Avec 90 magasins et des experts passionnés, Running Conseil vous guide vers l\'équipement adapté à votre pratique, quel que soit votre profil.', lien: 'https://www.instagram.com/runningconseilfrance/', bouton: 'Suivez nos actualités' },
      { place: 'infos', format: 'carte', tag: 'Fournisseur officiel', titre: 'Tā Energy', logo: 'https://static.wixstatic.com/media/df962b_b4e25c062d7b4e6bb3df84d31ef3df7a~mv2.png', image: 'https://static.wixstatic.com/media/df962b_5475ff2b10054be792dd2752b3569416~mv2.jpg', imagePos: '50% 50%', imageAlt: 'Gels, boissons et gommes énergétiques Tā Energy',
        texte: '3 tips pour réussir ta stratégie nutrition avec Tā Energy.', lien: 'https://www.ta-energy.com/blogs/conseils-nutrition/courir-un-marathon-ta-energy-hydratation-energie-recuperation', bouton: 'En savoir plus' },
      { place: 'apres', format: 'carte', icone: 'camera', tag: 'Photos officielles', titre: 'Les photos de votre course',
        texte: 'Des <strong>photographes professionnels</strong> seront présents sur les parcours (hors Galopades). Retrouvez et achetez vos photos dès le <strong>lundi 9 novembre</strong>, grâce à votre numéro de dossard.', lien: '', bouton: 'Accéder à vos photos', attente: 'Disponible le lundi 9 novembre' },
      { place: 'benevoles', format: 'carte', tag: 'Fournisseur officiel', titre: 'Thierry Immobilier', logo: 'https://static.wixstatic.com/media/df962b_6f7abd8985c64120a632b4574e4100d9~mv2.png', image: 'https://static.wixstatic.com/media/df962b_5d0d93df1129455abf1889fda62b439c~mv2.jpg', imagePos: '72% 40%', imageAlt: 'Une famille chez elle avec son chien',
        texte: 'Un cabinet familial à vos côtés pour tous vos projets immobiliers depuis 1924 : achat, vente, location, gestion locative, syndic, immobilier d\'entreprise.', lien: 'https://www.thierry-immobilier.fr/', bouton: 'Nous découvrir' },
      { place: 'supporters', format: 'carte', icone: 'live', tag: 'Suivi live', titre: 'Suivez votre coureur', image: 'https://static.wixstatic.com/media/df962b_f0360345e0ef49288e3cdcd310239121~mv2.jpg', imagePos: '50% 45%', imageAlt: 'Suivi live d\'un coureur sur l\'application Chrono Course',
        texte: 'Suivez votre coureur en temps réel et consultez ses temps de passage tous les 5 km grâce au suivi live sur l\'application Chrono Course (disponible uniquement pour les courses du dimanche).', lien: '', bouton: 'Suivre un coureur', attente: 'Lien disponible prochainement' }
    ],

    logos: [
      { nom: 'Amarris', groupe: 'Partenaire titre', logo: 'https://static.wixstatic.com/media/df962b_9f0cf5e586ff40589cf69bf73ccd31e0~mv2.png', lien: 'https://www.amarris.fr/' },
      { nom: 'Running Conseil', groupe: 'Partenaire officiel', logo: 'https://static.wixstatic.com/media/df962b_0512af0338794ff69c43b5c56a624d5b~mv2.png', lien: 'https://www.running-conseil.com/' },
      { nom: 'Tā Energy', groupe: 'Fournisseurs officiels', logo: 'https://static.wixstatic.com/media/df962b_b4e25c062d7b4e6bb3df84d31ef3df7a~mv2.png', lien: 'https://www.ta-energy.com/' },
      { nom: 'Campus', groupe: 'Fournisseurs officiels', logo: 'https://static.wixstatic.com/media/df962b_755fe74ff41b474fb2c2cd9d670cfc5f~mv2.png', lien: 'https://www.campus.coach/landing/ups/marathon-cote-d-amour-amarris?utm_source=referral&utm_medium=&utm_campaign=MCAA&utm_term=campuspartenaire&utm_content=' },
      { nom: 'Thierry Immobilier', groupe: 'Fournisseurs officiels', logo: 'https://static.wixstatic.com/media/df962b_6f7abd8985c64120a632b4574e4100d9~mv2.png', lien: 'https://www.thierry-immobilier.fr/' },
      { nom: 'La Baule', groupe: 'Partenaires institutionnels', logo: 'https://static.wixstatic.com/media/df962b_3cc027c8fb094ad8baaed85aab0a596a~mv2.png', lien: 'https://www.labaule.fr/' },
      { nom: 'Le Pouliguen', groupe: 'Partenaires institutionnels', logo: 'https://static.wixstatic.com/media/df962b_a6c7a6ffc75242f1bd18724b12daa39d~mv2.png', lien: 'https://www.lepouliguen.fr/' },
      { nom: 'Guérande', groupe: 'Partenaires institutionnels', logo: 'https://static.wixstatic.com/media/df962b_cb8ff8a0b2bf4c10856e2cb524ff5bfd~mv2.png', lien: 'https://www.ville-guerande.fr/' },
      { nom: 'Batz-sur-Mer', groupe: 'Partenaires institutionnels', logo: 'https://static.wixstatic.com/media/df962b_84278c4184134cca87970792faafc488~mv2.png', lien: 'https://www.ot-batzsurmer.fr/' },
      { nom: 'Le Croisic', groupe: 'Partenaires institutionnels', logo: 'https://static.wixstatic.com/media/df962b_b9068fdf95dc4f94859bba8cc777a533~mv2.png', lien: 'https://www.tourisme-lecroisic.fr/' }
    ]
  };

  var CSS = [
    'guide-coureur{display:block;width:100%}',
    '.gc-root{--gc-navy:#193E60;--gc-deep:#03263A;--gc-blue:#1D71B7;--gc-sky:#A9D0F2;--gc-ink:#03263A;--gc-text:#2C4459;--gc-muted:#5B6F83;--gc-line:#DCE4EC;--gc-mist:#F2F6FA;--gc-ok:#3E9B3A;--gc-mid:#EE8A00;--gc-hot:#E1262C;--gc-gut:clamp(16px,3.2vw,40px);--gc-top:0px;position:relative;font-family:"gc-roboto",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:16px;line-height:1.6;font-weight:400;color:var(--gc-text);background:#fff;text-align:left;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}',
    '.gc-root *,.gc-root *::before,.gc-root *::after{box-sizing:border-box}',
    '.gc-root :where(h1,h2,h3,h4,p,ul,ol,li,figure,figcaption,dl,dd){margin:0;padding:0}',
    '.gc-root :where(ul,ol){list-style:none}',
    '.gc-root :where(img){display:block;max-width:100%;height:auto;border:0}',
    '.gc-root :where(a){color:inherit;text-decoration:none}',
    '.gc-root :where(strong,b){font-weight:700}',
    '.gc-root sup{font-size:.62em;line-height:0;vertical-align:.5em;text-transform:none;letter-spacing:0}',
    '.gc-root :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit;-webkit-tap-highlight-color:transparent}',
    '.gc-root :focus-visible{outline:3px solid #5BA3E0;outline-offset:2px}',
    '.gc-content{container-type:inline-size;container-name:gc}',
    '.gc-wrap{width:100%;max-width:1280px;margin:0 auto;padding-left:var(--gc-gut);padding-right:var(--gc-gut)}',
    '.gc-ic{width:20px;height:20px;flex:none;display:inline-block;vertical-align:middle}',
    '.gc-sr{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;border:0!important}',

    '.gc-bar{position:sticky;top:var(--gc-top);z-index:30;background:rgba(255,255,255,.97);border-bottom:1px solid var(--gc-line)}',
    '@supports ((-webkit-backdrop-filter:blur(8px)) or (backdrop-filter:blur(8px))){.gc-bar{background:rgba(255,255,255,.9);-webkit-backdrop-filter:saturate(1.6) blur(10px);backdrop-filter:saturate(1.6) blur(10px)}}',
    '.gc-bar-in{display:flex;align-items:stretch;gap:18px;height:58px}',
    '.gc-brand{display:flex;flex-direction:column;justify-content:center;flex:none;padding-right:20px;border-right:1px solid var(--gc-line);line-height:1.1;cursor:pointer}',
    '.gc-bar.no-brand .gc-brand{display:none}',
    '.gc-navw{position:relative;display:flex;flex:1;min-width:0}',
    '.gc-nav-fl{position:absolute;top:0;bottom:0;z-index:2;display:none;align-items:center;justify-content:center;width:52px;color:var(--gc-navy);cursor:pointer}',
    '.gc-nav-fl span{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#fff;border:1px solid var(--gc-line);box-shadow:0 4px 12px -4px rgba(3,38,58,.35);transition:background-color .2s,color .2s,border-color .2s}',
    '.gc-nav-fl .gc-ic{width:18px;height:18px}',
    '.gc-nav-fl:hover span{background:var(--gc-navy);border-color:var(--gc-navy);color:#fff}',
    '.gc-nav-prev{left:0;justify-content:flex-start;background:linear-gradient(90deg,#fff 55%,rgba(255,255,255,0))}',
    '.gc-nav-next{right:0;justify-content:flex-end;background:linear-gradient(270deg,#fff 55%,rgba(255,255,255,0))}',
    '.gc-navw.can-prev .gc-nav-prev,.gc-navw.can-next .gc-nav-next{display:flex}',
    '.gc-nav-prev .gc-ic{transform:rotate(90deg)}',
    '.gc-nav-next .gc-ic{transform:rotate(-90deg)}',
    '.gc-brand b{font-weight:900;font-size:15px;letter-spacing:.02em;text-transform:uppercase;color:var(--gc-navy)}',
    '.gc-brand span{margin-top:4px;font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gc-blue)}',
    '.gc-nav{position:relative;display:flex;align-items:stretch;flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}',
    '.gc-bar.is-fit .gc-nav{justify-content:space-between}',
    '.gc-nav::-webkit-scrollbar{display:none}',
    '.gc-nav a{position:relative;display:flex;align-items:center;gap:8px;flex:none;padding:0 10px;font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--gc-navy);white-space:nowrap;transition:color .2s}',
    '.gc-nav a .gc-ic{width:16px;height:16px;color:var(--gc-blue)}',
    '.gc-bar.no-ic .gc-nav a .gc-ic{display:none}',
    '.gc-nav a::after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:3px;background:var(--gc-blue);transform:scaleX(0);transform-origin:left;transition:transform .25s}',
    '.gc-nav a:hover,.gc-nav a[aria-current="true"]{color:var(--gc-blue)}',
    '.gc-nav a[aria-current="true"]::after{transform:scaleX(1)}',
    '@container gc (max-width:759px){.gc-bar-in{height:50px;padding-left:4px;padding-right:0}.gc-brand,.gc-nav a .gc-ic{display:none}.gc-nav a{font-size:12.5px;padding:0 12px}.gc-nav a::after{left:12px;right:12px}.gc-nav-fl{width:46px}}',

    '.gc-hero{position:relative;isolation:isolate;overflow:hidden;color:#fff;background:var(--gc-deep)}',
    '.gc-hero>picture{position:absolute;inset:0;z-index:-2}',
    '.gc-hero-img{position:absolute;inset:0;width:100%;height:100%!important;max-width:none!important;object-fit:cover;z-index:-2}',
    '.gc-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(3,38,58,.94) 0%,rgba(3,38,58,.84) 34%,rgba(3,38,58,.42) 68%,rgba(3,38,58,.3) 100%),linear-gradient(0deg,rgba(3,38,58,.6) 0%,rgba(3,38,58,0) 45%)}',
    '.gc-hero-in{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:36px 56px;align-items:end;min-height:clamp(460px,64vh,640px);padding-top:clamp(56px,8vh,104px);padding-bottom:clamp(44px,7vh,88px)}',
    '.gc-pill{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:var(--gc-blue);color:#fff;font-weight:700;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;line-height:1.3}',
    '.gc-h1{margin-top:22px;font-weight:900;text-transform:uppercase;font-size:clamp(44px,6vw,96px);font-size:clamp(44px,6.4cqi,96px);line-height:.93;letter-spacing:-.005em;color:#fff}',
    '.gc-h1 em{display:block;font-style:normal;color:var(--gc-sky)}',
    '.gc-hero-intro{max-width:540px;margin-top:22px;font-size:clamp(16px,1.4cqi,19px);line-height:1.55;color:rgba(255,255,255,.9)}',
    '.gc-btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}',
    '.gc-hcard{padding:24px 24px 22px;border-radius:6px;background:rgba(3,38,58,.76);border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '.gc-count{display:flex;align-items:center;gap:14px;padding-bottom:18px;margin-bottom:18px;border-bottom:1px solid rgba(255,255,255,.16)}',
    '.gc-count b{font-weight:900;font-size:58px;line-height:.9;color:#fff;font-variant-numeric:tabular-nums}',
    '.gc-count b.is-txt{font-size:22px;line-height:1.2}',
    '.gc-count span{max-width:160px;font-size:14px;line-height:1.35;color:rgba(255,255,255,.82)}',
    '.gc-hcard-l{margin-top:8px}',
    '.gc-hcard-l li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;font-size:15px;color:rgba(255,255,255,.85);border-bottom:1px dashed rgba(255,255,255,.16)}',
    '.gc-hcard-l b{color:#fff;white-space:nowrap}',
    '.gc-hcard-p{display:flex;gap:8px;align-items:flex-start;margin-top:14px;font-size:14px;line-height:1.45;color:rgba(255,255,255,.82)}',
    '.gc-hcard-p .gc-ic{width:17px;height:17px;margin-top:1px;color:var(--gc-sky)}',
    '@container gc (max-width:899px){.gc-hero-in{grid-template-columns:minmax(0,1fr);align-items:start;min-height:0}.gc-hcard{max-width:460px}}',
    '@media (min-width:900px) and (max-height:820px){.gc-hero-in{min-height:0;padding-top:44px;padding-bottom:44px}.gc-h1{font-size:clamp(40px,5.4cqi,74px)}.gc-hero-intro{margin-top:16px}.gc-btns{margin-top:22px}.gc-count b{font-size:46px}}',

    '.gc-kick{font-weight:700;font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--gc-blue);line-height:1.4}',
    '.gc-hcard .gc-kick{color:var(--gc-sky)}',
    '.gc-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:12px 22px;border-radius:3px;font-weight:700;font-size:13.5px;letter-spacing:.07em;text-transform:uppercase;line-height:1.2;text-align:center;transition:background-color .2s,color .2s,border-color .2s}',
    '.gc-btn .gc-ic{width:18px;height:18px;transition:transform .2s}',
    'a.gc-btn:hover .gc-ic{transform:translateX(3px)}',
    '.gc-btn-white{background:#fff;color:var(--gc-navy)}',
    '.gc-btn-white:hover{background:var(--gc-sky)}',
    '.gc-btn-line{border:2px solid rgba(255,255,255,.75);color:#fff}',
    '.gc-btn-line:hover{background:#fff;color:var(--gc-navy);border-color:#fff}',
    '.gc-btn-blue{background:var(--gc-blue);color:#fff}',
    '.gc-btn-blue:hover{background:var(--gc-navy)}',
    '.gc-btn-navy{background:var(--gc-navy);color:#fff}',
    '.gc-btn-navy:hover{background:var(--gc-blue)}',
    '.gc-btn-off{cursor:default;color:rgba(255,255,255,.82);border:1px dashed rgba(255,255,255,.45);background:rgba(255,255,255,.08)}',
    '.gc-btn-offl{cursor:default;color:var(--gc-muted);border:1px dashed #AFC0D0;background:#fff}',
    '.gc-link{display:inline-flex;align-items:center;gap:7px;font-weight:700;font-size:14px;color:var(--gc-blue);border-bottom:1px solid transparent;transition:border-color .2s}',
    '.gc-link .gc-ic{width:16px;height:16px}',
    '.gc-link:hover{border-bottom-color:currentColor}',

    '.gc-sec{position:relative;padding:clamp(64px,8cqi,112px) 0}',
    '@media (max-height:820px){.gc-sec{padding:clamp(52px,6cqi,84px) 0}}',
    '.gc-alt{background:var(--gc-mist)}',
    '.gc-head{max-width:880px;margin-bottom:clamp(28px,3.4cqi,44px)}',
    '.gc-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:14px;font-weight:700;font-size:13px;letter-spacing:.14em;color:var(--gc-blue)}',
    '.gc-eyebrow::before{content:"";width:40px;height:4px;border-radius:2px;background:var(--gc-blue)}',
    '.gc-h2{font-weight:900;text-transform:uppercase;font-size:clamp(30px,3.5cqi,50px);line-height:1;letter-spacing:.005em;color:var(--gc-navy)}',
    '.gc-lead{margin-top:16px;font-size:clamp(16px,1.35cqi,19px);line-height:1.6;color:var(--gc-text)}',
    '.gc-lead p+p{margin-top:10px}',
    '.gc-h3{margin-bottom:16px;font-weight:900;font-size:clamp(21px,1.8cqi,27px);line-height:1.15;color:var(--gc-navy)}',
    '.gc-h3-big{margin-bottom:22px;font-size:clamp(24px,2.3cqi,32px);text-transform:uppercase}',
    '.gc-h4{margin-bottom:14px;font-weight:700;font-size:12.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--gc-blue)}',
    '.gc-small{font-size:14.5px;line-height:1.55;color:var(--gc-muted)}',
    '.gc-p{font-size:16px;line-height:1.6}',
    '.gc-rt{font-size:15.5px;line-height:1.65}',
    '.gc-rt p+p{margin-top:10px}',
    '.gc-rt a,.gc-p a{color:var(--gc-blue);font-weight:700;text-decoration:underline;text-underline-offset:2px}',
    '.gc-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,3.4cqi,48px);align-items:start}',
    '.gc-grid2.is-solo{grid-template-columns:minmax(0,1fr);max-width:820px}',
    '.gc-stack{display:flex;flex-direction:column;gap:16px;min-width:0}',
    '.gc-mt{margin-top:clamp(32px,3.6cqi,48px)}',
    '.gc-mt-s{margin-top:16px}',
    '.gc-mt-l{margin-top:clamp(44px,5cqi,72px)}',
    '.gc-anchor{scroll-margin-top:96px}',
    '@container gc (max-width:899px){.gc-grid2{grid-template-columns:minmax(0,1fr)}}',

    '.gc-note{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border-radius:4px;border-left:4px solid var(--gc-blue);background:#E9F2FB;color:var(--gc-ink);font-size:15px;line-height:1.55}',
    '.gc-note>.gc-ic{margin-top:1px;color:var(--gc-blue)}',
    '.gc-note-t{display:block;margin-bottom:2px}',
    '.gc-note-w{background:#FFF3E2;border-left-color:#E58A00}',
    '.gc-note-w>.gc-ic{color:#C26A00}',
    '.gc-note a{color:var(--gc-blue);font-weight:700;text-decoration:underline;text-underline-offset:2px}',

    '.gc-prog-box{max-width:none}',
    '.gc-tabs{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;border-bottom:2px solid var(--gc-line)}',
    '.gc-tabs::-webkit-scrollbar{display:none}',
    '.gc-tab{flex:none;margin-bottom:-2px;padding:14px 20px 13px;border-bottom:3px solid transparent;font-weight:700;font-size:15.5px;color:var(--gc-muted);white-space:nowrap;transition:color .2s,border-color .2s}',
    '.gc-tab:hover{color:var(--gc-navy)}',
    '.gc-tab-s{display:none}',
    '@container gc (max-width:479px){.gc-tab:has(.gc-tab-s) .gc-tab-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.gc-tab-s{display:inline}.gc-tabs{gap:0}.gc-tab{flex:1;text-align:center;padding:12px 6px}}',
    '.gc-tab[aria-selected="true"]{color:var(--gc-navy);border-bottom-color:var(--gc-blue)}',
    '.gc-pgrp{padding-top:20px}',
    '.gc-pgrp-l{display:flex;align-items:center;gap:8px;padding:4px 0 6px;font-weight:700;font-size:13.5px;letter-spacing:.02em;color:var(--gc-blue)}',
    '.gc-pgrp-l .gc-ic{width:16px;height:16px}',
    '.gc-prow{display:grid;grid-template-columns:150px minmax(0,1fr);gap:20px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--gc-line)}',
    '.gc-prow-h{font-weight:900;font-size:17px;color:var(--gc-navy);font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.gc-prow-t{font-weight:700;font-size:16.5px;line-height:1.4;color:var(--gc-ink)}',
    '.gc-prow-t em{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;background:var(--gc-mist);border:1px solid var(--gc-line);font-style:normal;font-weight:700;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--gc-muted);vertical-align:2px}',
    '.gc-prow.is-fort .gc-prow-h{color:var(--gc-blue)}',
    '.gc-prow.is-fort .gc-prow-t::before{content:"";display:inline-block;width:8px;height:8px;margin-right:10px;border-radius:50%;background:var(--gc-blue);vertical-align:2px}',
    '@container gc (max-width:599px){.gc-prow{grid-template-columns:92px minmax(0,1fr);gap:12px}.gc-prow-h{font-size:15px;white-space:normal}.gc-prow-t{font-size:15.5px}.gc-tab{padding:12px 14px;font-size:14.5px}}',

    '.gc-band{position:relative;isolation:isolate;overflow:hidden;color:#fff;background:var(--gc-deep) center/cover no-repeat}',
    '.gc-band-img{position:absolute;inset:0;width:100%;height:100%!important;max-width:none!important;object-fit:cover;z-index:-2}',
    '.gc-band::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(3,38,58,.9) 0%,rgba(3,38,58,.74) 36%,rgba(3,38,58,.12) 70%,rgba(3,38,58,0) 100%)}',
    '.gc-band.is-motif::before{background:linear-gradient(90deg,rgba(3,38,58,.7),rgba(3,38,58,.25))}',
    '.gc-band-in{display:flex;align-items:center;min-height:clamp(360px,32cqi,500px);padding-top:56px;padding-bottom:56px}',
    '.gc-band.is-motif .gc-band-in{min-height:0;padding-top:clamp(44px,5cqi,72px);padding-bottom:clamp(44px,5cqi,72px)}',
    '.gc-band-c{max-width:540px}',
    '.gc-band.is-edito .gc-band-c{max-width:620px}',
    '.gc-band.is-motif .gc-band-c{flex:1;max-width:none;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px 28px;align-items:center}',
    '.gc-band.is-motif .gc-band-c>.gc-band-ic{grid-row:span 3;margin:0}',
    '.gc-band.is-motif .gc-band-c>.gc-btn{grid-column:3;grid-row:1 / span 3;margin:0}',
    '.gc-band.is-motif .gc-band-t{margin-top:0}',
    '.gc-band.is-motif .gc-band-x{margin-top:0;max-width:640px}',
    '.gc-band-logo{height:46px!important;width:auto!important;max-width:220px!important;object-fit:contain;object-position:left center;margin-bottom:22px}',
    '.gc-band-ic{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;margin-bottom:20px;border-radius:50%;background:var(--gc-blue);color:#fff}',
    '.gc-band-ic .gc-ic{width:30px;height:30px}',
    '.gc-band-tag{font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gc-sky)}',
    '.gc-band-t{margin-top:10px;font-weight:900;text-transform:uppercase;font-size:clamp(28px,3.2cqi,46px);line-height:1.02}',
    '.gc-band-x{margin-top:14px;font-size:clamp(16px,1.4cqi,19px);line-height:1.55;color:rgba(255,255,255,.9)}',
    '.gc-band.is-edito .gc-band-x{font-size:16px;line-height:1.6}',
    '.gc-band-x p+p{margin-top:10px}',
    '.gc-sign{margin-top:18px;padding-left:14px;border-left:3px solid var(--gc-sky)}',
    '.gc-sign b{display:block;font-size:16px}',
    '.gc-sign span{font-size:14px;color:rgba(255,255,255,.75)}',
    '.gc-band .gc-btn{margin-top:26px}',
    '@media (max-height:820px){.gc-band.is-edito .gc-band-x{font-size:15px;line-height:1.55}.gc-band.is-edito .gc-band-x p+p{margin-top:7px}}',
    '@container gc (max-width:899px){.gc-band.is-motif .gc-band-c{grid-template-columns:auto minmax(0,1fr)}.gc-band.is-motif .gc-band-c>.gc-btn{grid-column:1 / -1;grid-row:auto;justify-self:start;margin-top:12px}}',
    '@container gc (max-width:759px){.gc-band-img{position:relative;inset:auto;display:block;width:100%;height:auto!important;aspect-ratio:16/10;z-index:0}.gc-band::before{display:none}.gc-band-in{min-height:0;padding-top:30px;padding-bottom:40px}.gc-band.is-motif .gc-band-c{grid-template-columns:minmax(0,1fr)}.gc-band.is-motif .gc-band-c>.gc-band-ic{grid-row:auto;width:52px;height:52px}}',

    '.gc-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);margin-top:clamp(40px,5cqi,64px);border-radius:8px;overflow:hidden;background:#fff;border:1px solid var(--gc-line);box-shadow:0 18px 40px -30px rgba(3,38,58,.4)}',
    '.gc-card-b{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:clamp(24px,3.2cqi,44px)}',
    '.gc-card-t{margin-top:8px;font-weight:900;text-transform:uppercase;font-size:clamp(24px,2.4cqi,34px);line-height:1.05;color:var(--gc-navy)}',
    '.gc-card-x{margin-top:12px;font-size:16px;line-height:1.6;color:var(--gc-text)}',
    '.gc-card .gc-btn{margin-top:22px}',
    '.gc-card-m{position:relative;min-height:280px;background:var(--gc-deep) center/cover no-repeat}',
    '.gc-card-img{position:absolute;inset:0;width:100%;height:100%!important;max-width:none!important;object-fit:cover}',
    '.gc-card-m.has-logo::after{content:"";position:absolute;left:0;right:0;bottom:0;height:50%;background:linear-gradient(0deg,rgba(3,38,58,.75),rgba(3,38,58,0))}',
    '.gc-card-logo{position:absolute;left:22px;bottom:20px;z-index:1;height:38px!important;width:auto!important;max-width:170px!important;object-fit:contain;object-position:left bottom}',
    '.gc-card-m.is-ic{display:flex;align-items:center;justify-content:center;min-height:220px}',
    '.gc-card-m.is-ic .gc-ic{width:64px;height:64px;color:var(--gc-sky);stroke-width:1.5}',
    '@container gc (max-width:759px){.gc-card{grid-template-columns:minmax(0,1fr)}.gc-card-m{order:-1;min-height:0;aspect-ratio:16/9}.gc-card-m.is-ic{aspect-ratio:auto;min-height:140px}}',

    '.gc-adrs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:14px}',
    '.gc-adr{display:flex;gap:14px;padding:20px;border-radius:6px;background:#fff;border:1px solid var(--gc-line)}',
    '.gc-adr-i{display:flex;align-items:center;justify-content:center;flex:none;width:40px;height:40px;border-radius:50%;background:#E4EEF8;color:var(--gc-blue)}',
    '.gc-adr-b{display:flex;flex-direction:column;gap:6px;min-width:0}',
    '.gc-adr-b>.gc-kick{font-size:13px;letter-spacing:.01em;text-transform:none;line-height:1.35}',
    '.gc-adr-l b{display:block;font-size:16px;line-height:1.35;color:var(--gc-ink)}',
    '.gc-adr-l span{display:block;font-size:14.5px;color:var(--gc-muted)}',
    '.gc-adr-ls li{padding:2px 0;font-size:15px;line-height:1.45;color:var(--gc-ink)}',
    '.gc-adr .gc-link{align-self:flex-start;margin-top:4px}',
    '.gc-circ{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 28px;margin-top:16px}',
    '.gc-circ p{flex:1;min-width:260px;font-size:15.5px;line-height:1.6}',
    '.gc-parks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}',
    '.gc-park{padding:22px 22px 6px;border-radius:6px;background:#fff;border:1px solid var(--gc-line)}',
    '.gc-park-h{margin-bottom:8px;font-weight:900;font-size:18px;color:var(--gc-navy)}',
    '.gc-park-i{padding:14px 0;border-top:1px solid var(--gc-line)}',
    '.gc-park-n{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;color:var(--gc-ink)}',
    '.gc-park-n .gc-ic{color:var(--gc-blue)}',
    '.gc-park-d{display:flex;flex-direction:column;gap:6px;margin-top:8px;padding-left:30px}',
    '.gc-park-d li{display:flex;align-items:baseline;gap:8px;font-size:14.5px;line-height:1.45}',
    '.gc-park-d .gc-ic{position:relative;top:2px;width:15px;height:15px;color:var(--gc-muted)}',
    '.gc-park-d em{margin-left:auto;padding-left:8px;flex:none;font-style:normal;font-weight:700;font-size:13px;color:var(--gc-blue);white-space:nowrap}',
    '@container gc (max-width:899px){.gc-parks{grid-template-columns:minmax(0,1fr)}}',
    '@container gc (max-width:479px){.gc-park-d{padding-left:0}.gc-park-d li{flex-wrap:wrap}.gc-park-d em{margin-left:23px;padding-left:0}}',
    '.gc-ter{display:flex;gap:20px;align-items:flex-start;margin-top:20px;padding:26px;border-radius:6px;background:var(--gc-navy);color:#fff}',
    '.gc-ter-i{display:flex;align-items:center;justify-content:center;flex:none;width:52px;height:52px;border-radius:50%;background:var(--gc-blue)}',
    '.gc-ter-i .gc-ic{width:26px;height:26px}',
    '.gc-ter .gc-h3{margin-bottom:8px;color:#fff}',
    '.gc-ter-x{font-size:15.5px;line-height:1.6;color:rgba(255,255,255,.88)}',
    '.gc-ter-p{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}',
    '.gc-ter-p li{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:4px;background:rgba(255,255,255,.1);font-size:14px}',
    '.gc-ter-p .gc-ic{width:16px;height:16px;color:var(--gc-sky)}',
    '@container gc (max-width:599px){.gc-ter{flex-direction:column;padding:22px}}',

    '.gc-sub{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}',
    '.gc-sub a{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;border:1px solid var(--gc-line);background:#fff;font-weight:700;font-size:13.5px;color:var(--gc-navy);transition:border-color .2s,color .2s}',
    '.gc-sub a .gc-ic{width:16px;height:16px;color:var(--gc-blue)}',
    '.gc-sub a:hover{border-color:var(--gc-blue);color:var(--gc-blue)}',
    '.gc-box{padding:24px;border-radius:6px;background:var(--gc-mist);border:1px solid var(--gc-line)}',
    '.gc-box-h{display:flex;gap:14px;align-items:flex-start}',
    '.gc-box-h>.gc-ic{width:24px;height:24px;margin-top:2px;color:var(--gc-blue)}',
    '.gc-box-t{margin-top:4px;font-weight:700;font-size:18px;line-height:1.35;color:var(--gc-ink)}',
    '.gc-box-s{font-size:15px;color:var(--gc-muted)}',
    '.gc-hor{margin:18px 0 14px}',
    '.gc-hor li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px;padding:11px 0;border-top:1px solid var(--gc-line);font-size:15.5px}',
    '.gc-hor b{font-weight:900;color:var(--gc-navy);white-space:nowrap}',
    '.gc-aff{position:relative;isolation:isolate;overflow:hidden;padding:26px 26px 20px;border-radius:8px;background:var(--gc-deep) center/cover no-repeat;color:#fff}',
    '.gc-aff::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(160deg,rgba(3,38,58,.3),rgba(3,38,58,.72))}',
    '.gc-aff-t{font-weight:900;font-size:22px;line-height:1.1;text-transform:uppercase}',
    '.gc-aff-i{margin-top:6px;font-size:14.5px;color:rgba(255,255,255,.82)}',
    '.gc-aff-d{display:grid;grid-template-columns:104px minmax(0,1fr);gap:14px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.16)}',
    '.gc-aff-j{font-weight:900;font-size:14.5px;line-height:1.25;text-transform:uppercase}',
    '.gc-aff-r{display:grid;grid-template-columns:76px minmax(0,1fr) 104px;align-items:center;gap:10px;padding:3px 0;font-size:14px;font-variant-numeric:tabular-nums}',
    '.gc-aff-bar{height:9px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden}',
    '.gc-aff-bar i{display:block;height:100%;border-radius:5px}',
    '.gc-aff .n1 i{width:34%;background:var(--gc-ok)}',
    '.gc-aff .n2 i{width:66%;background:var(--gc-mid)}',
    '.gc-aff .n3 i{width:100%;background:var(--gc-hot)}',
    '.gc-aff-r em{font-style:normal;font-size:12.5px;color:rgba(255,255,255,.78)}',
    '@container gc (max-width:520px){.gc-aff{padding:22px 18px 16px}.gc-aff-d{grid-template-columns:minmax(0,1fr);gap:6px}.gc-aff-r{grid-template-columns:68px minmax(0,1fr) 96px}}',
    '.gc-docs li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--gc-line);font-size:15.5px;line-height:1.5}',
    '.gc-docs .gc-ic{width:20px;height:20px;margin-top:1px;padding:3px;border-radius:50%;background:var(--gc-blue);color:#fff;stroke-width:3}',
    '.gc-docs+.gc-btn{align-self:flex-start;margin-top:6px}',
    '.gc-lots{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:12px;margin-top:14px}',
    '.gc-lot{display:flex;gap:14px;align-items:center;padding:18px;border-radius:6px;background:var(--gc-mist);border:1px solid var(--gc-line);font-size:15.5px;line-height:1.45}',
    '.gc-lot span{font-size:28px;line-height:1}',
    '.gc-acc-w{max-width:980px}',
    '.gc-acc2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}',
    '@container gc (max-width:899px){.gc-acc2{grid-template-columns:minmax(0,1fr);gap:0}.gc-acc2>.gc-acc:first-child{border-radius:6px 6px 0 0}.gc-acc2>.gc-acc+.gc-acc{margin-top:-1px;border-radius:0 0 6px 6px}}',
    '.gc-expo{columns:3 200px;column-gap:24px}',
    '.gc-expo li{break-inside:avoid;padding:6px 0;border-bottom:1px solid var(--gc-line);font-size:15px}',
    '.gc-shop{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,400px);margin-top:24px;border-radius:8px;overflow:hidden;background:var(--gc-deep);color:#fff}',
    '.gc-shop-b{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:clamp(26px,4cqi,56px)}',
    '.gc-shop .gc-kick{color:var(--gc-sky)}',
    '.gc-shop .gc-card-t{color:#fff}',
    '.gc-shop .gc-card-x{color:rgba(255,255,255,.85)}',
    '.gc-shop .gc-btn{margin-top:22px}',
    '.gc-shop-m img{width:100%;height:100%!important;aspect-ratio:4/5;object-fit:cover}',
    '@container gc (max-width:759px){.gc-shop{grid-template-columns:minmax(0,1fr)}.gc-shop-m{order:-1}.gc-shop-m img{aspect-ratio:auto;height:auto!important}}',

    '.gc-acc{padding:0 20px;border-radius:6px;background:#fff;border:1px solid var(--gc-line)}',
    '.gc-acc-i+.gc-acc-i{border-top:1px solid var(--gc-line)}',
    '.gc-acc-hh{font-size:inherit;font-weight:inherit;line-height:inherit}',
    '.gc-acc-h{display:flex;align-items:center;gap:14px;width:100%;padding:18px 0;font-weight:700;font-size:16.5px;line-height:1.35;color:var(--gc-ink)}',
    '.gc-acc-h:hover .gc-acc-l{color:var(--gc-blue)}',
    '.gc-acc-e{flex:none;width:30px;font-size:21px;line-height:1;text-align:center}',
    '.gc-acc-l{flex:1;min-width:0;transition:color .2s}',
    '.gc-acc-h>.gc-ic{color:var(--gc-blue);transition:transform .25s}',
    '.gc-acc-h[aria-expanded="true"]>.gc-ic{transform:rotate(180deg)}',
    '.gc-acc-p{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease}',
    '.gc-acc-p>div{min-height:0;overflow:hidden;visibility:hidden;transition:visibility .3s}',
    '.gc-acc-i.is-open .gc-acc-p{grid-template-rows:1fr}',
    '.gc-acc-i.is-open .gc-acc-p>div{visibility:visible}',
    '.gc-acc-c{padding:0 0 22px;font-size:15.5px;line-height:1.65;color:var(--gc-text)}',
    '.gc-acc-i.has-e .gc-acc-c{padding-left:44px}',
    '.gc-acc-c p+p,.gc-acc-c p+ul,.gc-acc-c ul+p{margin-top:10px}',
    '.gc-acc-c ul li{position:relative;margin-top:6px;padding-left:18px}',
    '.gc-acc-c ul li::before{content:"";position:absolute;left:2px;top:.65em;width:6px;height:6px;border-radius:50%;background:var(--gc-blue)}',
    '.gc-acc-c a{color:var(--gc-blue);font-weight:700;text-decoration:underline;text-underline-offset:2px}',
    '@container gc (max-width:599px){.gc-acc{padding:0 14px}.gc-acc-h{font-size:15.5px}.gc-acc-i.has-e .gc-acc-c{padding-left:0}}',

    '.gc-pick{display:flex;flex-wrap:wrap;gap:18px 32px;margin-bottom:24px}',
    '.gc-pick-g{min-width:0}',
    '.gc-pick-d{margin-bottom:10px;font-weight:700;font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:var(--gc-muted)}',
    '.gc-pick-r{display:flex;flex-wrap:wrap;gap:8px}',
    '.gc-race{display:flex;flex-direction:column;align-items:flex-start;min-width:132px;padding:12px 18px 11px;border:2px solid var(--gc-line);border-radius:4px;background:#fff;transition:border-color .2s,background-color .2s}',
    '.gc-race b{font-weight:900;font-size:17px;line-height:1.15;text-transform:uppercase;color:var(--gc-navy)}',
    '.gc-race span{margin-top:3px;font-size:13.5px;color:var(--gc-muted)}',
    '.gc-race:hover{border-color:var(--gc-blue)}',
    '.gc-race[aria-pressed="true"]{background:var(--gc-navy);border-color:var(--gc-navy)}',
    '.gc-race[aria-pressed="true"] b,.gc-race[aria-pressed="true"] span{color:#fff}',
    '@container gc (max-width:599px){.gc-pick{display:grid;grid-template-columns:minmax(0,1fr);gap:18px}.gc-pick-r{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.gc-race{min-width:0;padding:10px 12px}.gc-race b{font-size:14.5px}}',
    '.gc-rp{padding:clamp(22px,3.4cqi,44px);border-radius:8px;background:#fff;border:1px solid var(--gc-line)}',
    '.gc-rp-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 24px;margin-bottom:26px;padding-bottom:24px;border-bottom:1px solid var(--gc-line)}',
    '.gc-rp-t{margin-top:6px;font-weight:900;text-transform:uppercase;font-size:clamp(32px,3.6cqi,52px);line-height:.98;color:var(--gc-navy)}',
    '.gc-rp-s{margin-top:8px;font-size:16px;color:var(--gc-muted)}',
    '.gc-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:12px}',
    '.gc-fact{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border-radius:6px;background:var(--gc-mist)}',
    '.gc-fact>.gc-ic{width:22px;height:22px;margin-top:2px;color:var(--gc-blue)}',
    '.gc-fact-k{font-weight:700;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--gc-muted)}',
    '.gc-fact-v{margin-top:4px;font-weight:700;font-size:16px;line-height:1.4;color:var(--gc-ink)}',
    '.gc-deps{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px}',
    '.gc-dep{display:flex;gap:16px;align-items:center;padding:16px 18px;border-radius:6px;border:1px solid var(--gc-line)}',
    '.gc-dep>b{font-weight:900;font-size:24px;color:var(--gc-blue);font-variant-numeric:tabular-nums}',
    '.gc-dep strong{display:block;font-size:16px;color:var(--gc-ink)}',
    '.gc-dep span{font-size:14px;color:var(--gc-muted)}',
    '.gc-cons{display:grid;grid-template-columns:260px minmax(0,1fr);margin-top:clamp(28px,3cqi,40px);border-radius:8px;overflow:hidden;border:1px solid var(--gc-line)}',
    '.gc-cons-h{display:flex;flex-direction:column;justify-content:center;gap:10px;padding:24px;background:var(--gc-navy);color:#fff}',
    '.gc-cons-h>.gc-ic{width:34px;height:34px;color:var(--gc-sky);stroke-width:1.6}',
    '.gc-cons-h .gc-kick{color:var(--gc-sky)}',
    '.gc-cons-h b{display:block;font-weight:900;font-size:22px;line-height:1.15}',
    '.gc-cons-b{padding:22px 24px;font-size:15.5px;line-height:1.6}',
    '.gc-cons-b ul{margin-top:12px}',
    '.gc-cons-b li{display:flex;gap:10px;align-items:flex-start;padding:5px 0}',
    '.gc-cons-b li .gc-ic{width:18px;height:18px;margin-top:3px;color:var(--gc-blue);stroke-width:2.6}',
    '@container gc (max-width:699px){.gc-cons{grid-template-columns:minmax(0,1fr)}.gc-cons-h{flex-direction:row;align-items:center}}',
    '.gc-tl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-radius:6px;overflow:hidden;border:1px solid var(--gc-line)}',
    '.gc-tl>div{padding:14px 16px;border-right:1px solid var(--gc-line);background:#fff}',
    '.gc-tl>div:last-child{border-right:0;background:var(--gc-navy);color:#fff}',
    '.gc-tl span{display:block;font-size:12.5px;line-height:1.3;color:var(--gc-muted)}',
    '.gc-tl>div:last-child span{color:rgba(255,255,255,.75)}',
    '.gc-tl b{display:block;margin-top:4px;font-weight:900;font-size:26px;line-height:1;color:var(--gc-navy);font-variant-numeric:tabular-nums}',
    '.gc-tl>div:last-child b{color:#fff}',
    '@container gc (max-width:479px){.gc-tl>div{padding:12px 10px}.gc-tl b{font-size:21px}.gc-tl span{font-size:11.5px}}',
    '.gc-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '.gc-chip{display:inline-flex;align-items:center;padding:8px 14px;border-radius:999px;background:var(--gc-mist);border:1px solid var(--gc-line);font-weight:900;font-size:15px;color:var(--gc-navy);font-variant-numeric:tabular-nums}',
    '.gc-fig-b{position:relative;display:block;width:100%;border-radius:6px;overflow:hidden;border:1px solid var(--gc-line);background:#fff;cursor:zoom-in}',
    '.gc-fig-b img{width:100%}',
    '.gc-fig-z{position:absolute;right:10px;bottom:10px;display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:3px;background:rgba(3,38,58,.88);color:#fff;font-weight:700;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase}',
    '.gc-fig-z .gc-ic{width:15px;height:15px}',
    '.gc-fig figcaption{margin-top:8px;font-size:13px;color:var(--gc-muted)}',

    '.gc-rule{display:flex;flex-wrap:wrap;align-items:center;gap:16px 22px;padding:22px 24px;border-radius:6px;background:var(--gc-mist);border:1px solid var(--gc-line)}',
    '.gc-rule>.gc-ic{width:34px;height:34px;color:var(--gc-blue);stroke-width:1.7}',
    '.gc-rule>div{flex:1;min-width:220px}',
    '.gc-rule b{font-weight:900;font-size:19px;color:var(--gc-navy)}',
    '.gc-rule p{font-size:15px}',
    '.gc-dq{margin-top:14px}',
    '.gc-dq li{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--gc-line);font-size:15.5px;line-height:1.5}',
    '.gc-dq .gc-ic{width:19px;height:19px;margin-top:2px;color:var(--gc-hot)}',
    '.gc-lims{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0 18px}',
    '.gc-lim{padding:16px 18px;border-radius:6px;background:var(--gc-navy);color:#fff}',
    '.gc-lim span{display:block;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gc-sky)}',
    '.gc-lim b{display:block;margin-top:4px;font-weight:900;font-size:32px;line-height:1;font-variant-numeric:tabular-nums}',
    '.gc-hd{margin-top:18px}',

    '.gc-pods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}',
    '.gc-pod{padding:22px 24px;border-radius:6px;background:var(--gc-navy);color:#fff}',
    '.gc-pod .gc-kick{color:var(--gc-sky)}',
    '.gc-pod ul{margin:10px 0 12px}',
    '.gc-pod li{display:flex;gap:16px;align-items:baseline;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.14)}',
    '.gc-pod li b{min-width:76px;font-weight:900;font-size:22px;font-variant-numeric:tabular-nums}',
    '.gc-pod li span{font-weight:700;font-size:16px}',
    '.gc-pod p{display:flex;gap:8px;font-size:14px;color:rgba(255,255,255,.8)}',
    '.gc-pod p .gc-ic{width:16px;height:16px;margin-top:2px;color:var(--gc-sky)}',
    '@container gc (max-width:699px){.gc-pods{grid-template-columns:minmax(0,1fr)}}',

    '.gc-bene{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(28px,4.4cqi,64px);align-items:center}',
    '.gc-bene .gc-rt{font-size:16.5px}',
    '.gc-bene .gc-btn{margin-top:24px}',
    '.gc-stat{position:relative;isolation:isolate;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-height:320px;padding:34px;border-radius:8px;background:var(--gc-deep) center/cover no-repeat;color:#fff}',
    '.gc-stat::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(3,38,58,.05),rgba(3,38,58,.7))}',
    '.gc-stat b{font-weight:900;font-size:clamp(64px,7cqi,104px);line-height:.9}',
    '.gc-stat span{max-width:320px;margin-top:12px;font-size:17px;line-height:1.45;color:rgba(255,255,255,.9)}',
    '.gc-bene-img{border-radius:8px;overflow:hidden}',
    '.gc-bene-img img{width:100%;aspect-ratio:4/3;object-fit:cover}',
    '@container gc (max-width:899px){.gc-bene{grid-template-columns:minmax(0,1fr)}.gc-stat{min-height:220px}}',

    '.gc-sup-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}',
    '.gc-live{display:flex;gap:18px;align-items:flex-start;margin-top:clamp(32px,3.6cqi,48px);padding:24px;border-radius:6px;background:var(--gc-mist);border:1px solid var(--gc-line)}',
    '.gc-live-i{display:flex;align-items:center;justify-content:center;flex:none;width:52px;height:52px;border-radius:50%;background:var(--gc-blue);color:#fff}',
    '.gc-live-i .gc-ic{width:24px;height:24px}',
    '.gc-live .gc-h3{margin-bottom:6px}',
    '@container gc (max-width:599px){.gc-live{flex-direction:column}}',

    '.gc-partners{isolation:isolate;overflow:hidden;background:var(--gc-deep);color:#fff}',
    '.gc-partners::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--gc-motif,none) center/cover no-repeat;opacity:.45}',
    '.gc-partners .gc-h2{color:#fff}',
    '.gc-partners .gc-eyebrow{color:var(--gc-sky)}',
    '.gc-partners .gc-eyebrow::before{background:var(--gc-sky)}',
    '.gc-pg{display:grid;grid-template-columns:220px minmax(0,1fr);gap:16px 32px;align-items:center;padding:26px 0;border-top:1px solid rgba(255,255,255,.16)}',
    '.gc-pg-l{font-weight:700;font-size:12.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--gc-sky)}',
    '.gc-pg-r{display:flex;flex-wrap:wrap;align-items:center;gap:22px 48px}',
    '.gc-logo{display:flex;align-items:center;height:54px;transition:opacity .2s}',
    '.gc-logo img{height:100%!important;width:auto!important;max-width:190px!important;object-fit:contain}',
    '.gc-pg.is-main .gc-logo{height:72px}',
    '.gc-pg.is-main .gc-logo img{max-width:280px!important}',
    'a.gc-logo:hover{opacity:.72}',
    '.gc-logo span{font-weight:700;font-size:16px}',
    '@container gc (max-width:759px){.gc-pg{grid-template-columns:minmax(0,1fr)}.gc-pg-r{gap:18px 30px}.gc-logo{height:42px}.gc-logo img{max-width:140px!important}.gc-pg.is-main .gc-logo{height:56px}}',

    '.gc-top{position:fixed;right:clamp(14px,2vw,28px);bottom:clamp(14px,2vw,28px);z-index:60;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:var(--gc-navy);color:#fff;box-shadow:0 10px 26px -10px rgba(3,38,58,.6);opacity:0;visibility:hidden;transform:translateY(10px);transition:opacity .25s,transform .25s,visibility .25s,background-color .2s}',
    '.gc-top.on{opacity:1;visibility:visible;transform:none}',
    '.gc-top:hover{background:var(--gc-blue)}',

    '.gc-lb{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:64px 16px 64px;background:rgba(3,20,32,.94);font-family:"gc-roboto",Roboto,Arial,sans-serif}',
    '.gc-lb-in{max-width:100%;max-height:100%;overflow:auto;border-radius:6px;background:#fff}',
    '.gc-lb-in img{display:block;width:min(1700px,94vw);max-width:none;height:auto}',
    '.gc-lb-x{position:absolute;top:12px;right:12px;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border:0;border-radius:50%;background:#fff;color:#03263A;cursor:pointer}',
    '.gc-lb-x .gc-ic{width:22px;height:22px}',
    '.gc-lb-o{position:absolute;left:50%;bottom:18px;display:inline-flex;align-items:center;gap:8px;transform:translateX(-50%);color:#fff;font-weight:700;font-size:14px;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}',
    '.gc-lb-o .gc-ic{width:16px;height:16px}',

    '@media (prefers-reduced-motion:reduce){.gc-root *,.gc-root *::before,.gc-root *::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}}'
  ].join('');

  var SKEL = "guide-coureur .gc-skel{display:block;width:100%;position:relative;overflow:hidden}guide-coureur .gc-skel::before{content:\"\";position:absolute;left:0;right:0;background-color:#03263A;background-repeat:no-repeat;background-size:45% 100%,100% 100%,100% 100%,cover;background-position:-60% 0,0 0,0 0,50% 35%;animation:gc-sk-reflet 1.6s ease-in-out infinite}guide-coureur .gc-skel::after{content:\"\";position:absolute;top:0;left:max(0px, calc((100% - 1280px) / 2));right:max(0px, calc((100% - 1280px) / 2));padding:0 clamp(16px, 3.2vw, 40px)}guide-coureur .gc-skel{min-height:1340px;background:linear-gradient(#DCE4EC,#DCE4EC) left 0 top 50px / 100% 1px no-repeat,#FFFFFF}guide-coureur .gc-skel::before{top:51px;height:869px;background-image:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.09) 50%,rgba(255,255,255,0) 70%),linear-gradient(90deg,rgba(3,38,58,.94) 0%,rgba(3,38,58,.84) 34%,rgba(3,38,58,.42) 68%,rgba(3,38,58,.3) 100%),linear-gradient(0deg,rgba(3,38,58,.6) 0%,rgba(3,38,58,0) 45%),url(\"https://static.wixstatic.com/media/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg/v1/fit/w_1000,h_2000,q_85,enc_auto/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg\")}guide-coureur .gc-skel::after{height:920px;background:repeating-linear-gradient(90deg,#E3EAF1 0 82px,transparent 82px 116px) left 0px top 20px / 100% 11px no-repeat,linear-gradient(rgba(29,113,183,.92),rgba(29,113,183,.92)) left 0px top 118px / 261px 30px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 172px / 192px 38px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 213px / 198px 38px no-repeat,linear-gradient(rgba(169,208,242,.4),rgba(169,208,242,.4)) left 0px top 254px / 101px 38px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 321px / min(340px, 100%) 12px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 346px / min(330px, 96%) 12px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 371px / 200px 12px no-repeat,linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)) left 0px top 420px / 225px 48px no-repeat,linear-gradient(rgba(255,255,255,.16),rgba(255,255,255,.16)) left 0px top 480px / 196px 48px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 590px / 64px 46px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 670px / 140px 10px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 700px / calc(100% - 48px) 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 740px / calc(100% - 48px) 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 792px / 220px 12px no-repeat,linear-gradient(rgba(3,38,58,.74),rgba(3,38,58,.74)) left 0px top 564px / 100% 297px no-repeat;background-origin:content-box;background-clip:content-box}@media (min-width:760px){guide-coureur .gc-skel{min-height:1259px;background:linear-gradient(#DCE4EC,#DCE4EC) left 0 top 58px / 100% 1px no-repeat,#FFFFFF}guide-coureur .gc-skel::before{top:59px;height:780px;background-image:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.09) 50%,rgba(255,255,255,0) 70%),linear-gradient(90deg,rgba(3,38,58,.94) 0%,rgba(3,38,58,.84) 34%,rgba(3,38,58,.42) 68%,rgba(3,38,58,.3) 100%),linear-gradient(0deg,rgba(3,38,58,.6) 0%,rgba(3,38,58,0) 45%),url(\"https://static.wixstatic.com/media/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg/v1/fit/w_1920,h_3840,q_85,enc_auto/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg\")}guide-coureur .gc-skel::after{height:839px;background:repeating-linear-gradient(90deg,#E3EAF1 0 82px,transparent 82px 116px) left 0px top 24px / 100% 11px no-repeat,linear-gradient(rgba(29,113,183,.92),rgba(29,113,183,.92)) left 0px top 141px / 261px 30px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 195px / min(448px, 100%) 42px no-repeat,linear-gradient(rgba(169,208,242,.4),rgba(169,208,242,.4)) left 0px top 241px / 113px 42px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 312px / min(540px, 100%) 12px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 337px / 300px 12px no-repeat,linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)) left 0px top 386px / 225px 48px no-repeat,linear-gradient(rgba(255,255,255,.16),rgba(255,255,255,.16)) left 237px top 386px / 196px 48px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 496px / 64px 46px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 576px / 140px 10px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 606px / calc(100% - 48px) 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 646px / calc(100% - 48px) 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) left 24px top 698px / 220px 12px no-repeat,linear-gradient(rgba(3,38,58,.74),rgba(3,38,58,.74)) left 0px top 470px / min(460px, 100%) 297px no-repeat;background-origin:content-box;background-clip:content-box}}@media (min-width:900px) and (max-height:820px){guide-coureur .gc-skel{min-height:1170px;background:linear-gradient(#DCE4EC,#DCE4EC) left 0 top 58px / 100% 1px no-repeat,linear-gradient(#03263A,#03263A) left 0 top 467px / 100% 283px no-repeat,#FFFFFF}guide-coureur .gc-skel::before{top:59px;height:408px;background-image:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.09) 50%,rgba(255,255,255,0) 70%),linear-gradient(90deg,rgba(3,38,58,.94) 0%,rgba(3,38,58,.84) 34%,rgba(3,38,58,.42) 68%,rgba(3,38,58,.3) 100%),linear-gradient(0deg,rgba(3,38,58,.6) 0%,rgba(3,38,58,0) 45%),url(\"https://static.wixstatic.com/media/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg/v1/fit/w_1920,h_3840,q_85,enc_auto/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg\")}guide-coureur .gc-skel::after{height:467px;background:repeating-linear-gradient(90deg,#E3EAF1 0 82px,transparent 82px 116px) left 0px top 24px / 100% 11px no-repeat,linear-gradient(rgba(29,113,183,.92),rgba(29,113,183,.92)) left 0px top 103px / 261px 30px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 162px / min(623px, 55%) 52px no-repeat,linear-gradient(rgba(169,208,242,.4),rgba(169,208,242,.4)) left 0px top 225px / 157px 52px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 305px / min(540px, 50%) 13px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 332px / 300px 13px no-repeat,linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)) left 0px top 375px / 225px 48px no-repeat,linear-gradient(rgba(255,255,255,.16),rgba(255,255,255,.16)) left 237px top 375px / 196px 48px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 252px top 163px / 64px 46px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 176px top 243px / 140px 10px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 24px top 273px / 292px 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 24px top 313px / 292px 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 96px top 365px / 220px 12px no-repeat,linear-gradient(rgba(3,38,58,.74),rgba(3,38,58,.74)) right 0px top 137px / 340px 286px no-repeat;background-origin:content-box;background-clip:content-box}}@media (min-width:900px) and (min-height:821px){guide-coureur .gc-skel{min-height:1392px;background:linear-gradient(#DCE4EC,#DCE4EC) left 0 top 58px / 100% 1px no-repeat,linear-gradient(#03263A,#03263A) left 0 top 689px / 100% 283px no-repeat,#FFFFFF}guide-coureur .gc-skel::before{top:59px;height:630px;background-image:linear-gradient(100deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.09) 50%,rgba(255,255,255,0) 70%),linear-gradient(90deg,rgba(3,38,58,.94) 0%,rgba(3,38,58,.84) 34%,rgba(3,38,58,.42) 68%,rgba(3,38,58,.3) 100%),linear-gradient(0deg,rgba(3,38,58,.6) 0%,rgba(3,38,58,0) 45%),url(\"https://static.wixstatic.com/media/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg/v1/fit/w_1920,h_3840,q_85,enc_auto/a7d6aa_481345e1a43048b8826112ecbda69b4a~mv2.jpg\")}guide-coureur .gc-skel::after{height:689px;background:repeating-linear-gradient(90deg,#E3EAF1 0 82px,transparent 82px 116px) left 0px top 24px / 100% 11px no-repeat,linear-gradient(rgba(29,113,183,.92),rgba(29,113,183,.92)) left 0px top 131px / 261px 30px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 190px / 399px 68px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 275px / 411px 68px no-repeat,linear-gradient(rgba(169,208,242,.4),rgba(169,208,242,.4)) left 0px top 360px / 209px 68px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 466px / 540px 14px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 495px / 520px 14px no-repeat,linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)) left 0px top 524px / 300px 14px no-repeat,linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,.9)) left 0px top 578px / 225px 48px no-repeat,linear-gradient(rgba(255,255,255,.16),rgba(255,255,255,.16)) left 237px top 578px / 196px 48px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 252px top 355px / 64px 46px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 176px top 435px / 140px 10px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 24px top 465px / 292px 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 24px top 505px / 292px 12px no-repeat,linear-gradient(rgba(255,255,255,.18),rgba(255,255,255,.18)) right 96px top 557px / 220px 12px no-repeat,linear-gradient(rgba(3,38,58,.74),rgba(3,38,58,.74)) right 0px top 329px / 340px 297px no-repeat;background-origin:content-box;background-clip:content-box}}@keyframes gc-sk-reflet{to{background-position:160% 0,0 0,0 0,50% 35%}}@media (prefers-reduced-motion:reduce){guide-coureur .gc-skel::before{animation:none;background-position:-60% 0,0 0,0 0,50% 35%}}";

  class GuideCoureur extends HTMLElement {
    static get observedAttributes() { return ['payload', 'lang', 'source', 'media-base']; }
    constructor() {
      super();
      this._initialized = false; this._teardown = []; this._renderRAF = null; this._scrollRAF = null; this._bootTimer = null;
      this._state = { payload: null, lang: 'fr', course: null, day: null };
      this._pendingPayload = null; this._pendingLang = null; this._jump = false;
      this._ready = false; this._root = null; this._content = null; this._activeId = ''; this._lb = null; this._lbBack = null; this._top = -1;
    }
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;
      this.setAttribute('translate', 'no'); this.classList.add('notranslate');
      this.innerHTML = '<style>' + FONTS + CSS + SKEL + '</style>' + ICONS + '<div class="gc-root"><div class="gc-content"></div><button type="button" class="gc-top" data-act="top" aria-label="' + escAttr(DICT.fr.top) + '">' + ic('up') + '</button></div>';
      this._root = this.querySelector('.gc-root');
      this._content = this.querySelector('.gc-content');
      if (this._pendingLang) { this._state.lang = this._pendingLang; this._pendingLang = null; }
      if (this._pendingPayload) { this._state.payload = this._pendingPayload; this._pendingPayload = null; }
      this._restore();
      var self = this;
      if (this._state.payload || this.hasAttribute('payload')) { this._ready = true; this._render(); }
      else {
        var cached = this._cacheRead();
        if (cached) { this._state.payload = cached; this._ready = true; this._render(); }
        else if (!this._endpoint()) { this._ready = true; this._render(); }
        else {
          this._content.innerHTML = this._skeleton();
          this._bootTimer = setTimeout(function () { self._bootTimer = null; if (!self._initialized || self._ready) return; self._ready = true; self._render(); }, 2500);
        }
        this._fetch();
      }
    }
    disconnectedCallback() {
      if (this._renderRAF) { cancelAnimationFrame(this._renderRAF); this._renderRAF = null; }
      if (this._scrollRAF) { cancelAnimationFrame(this._scrollRAF); this._scrollRAF = null; }
      if (this._bootTimer) { clearTimeout(this._bootTimer); this._bootTimer = null; }
      this._closeLb(true);
      this._teardown.forEach(function (fn) { try { fn(); } catch (e) {} });
      this._teardown = []; this._initialized = false;
    }
    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (!this._initialized) {
        if (name === 'payload') { try { this._pendingPayload = JSON.parse(newVal || '{}'); } catch (e) { this._pendingPayload = {}; } }
        else if (name === 'lang') this._pendingLang = newVal;
        return;
      }
      if (name === 'payload') { try { this._state.payload = JSON.parse(newVal || '{}'); } catch (e) { console.error('[guide-coureur] payload illisible', e); this._state.payload = {}; } }
      else if (name === 'lang') this._state.lang = newVal;
      else if (name === 'source') return;
      if (this._bootTimer) { clearTimeout(this._bootTimer); this._bootTimer = null; }
      this._ready = true;
      this._scheduleRender();
    }
    _endpoint() {
      var src = this.getAttribute('source');
      if (src === 'none') return '';
      return (src ? src.replace(/\/$/, '') : '') + '/_functions/guideCoureur?lang=' + (this._state.lang === 'en' ? 'en' : 'fr');
    }
    _cacheKey() { return 'mica-guide-data-' + (this._state.lang === 'en' ? 'en' : 'fr'); }
    _cacheRead() {
      if (!this._endpoint()) return null;
      try { var raw = window.sessionStorage.getItem(this._cacheKey()); if (!raw) return null; var o = JSON.parse(raw); return o && o.t && Date.now() - o.t < 600000 ? o.d : null; } catch (e) { return null; }
    }
    _fetch() {
      var self = this, url = this._endpoint(), done = false;
      if (!url || typeof fetch !== 'function') return;
      var guard = setTimeout(function () { done = true; }, 8000);
      this._teardown.push(function () { clearTimeout(guard); done = true; });
      fetch(url, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (d) {
        clearTimeout(guard);
        if (done || !self._initialized || self.hasAttribute('payload') || !d || typeof d !== 'object') return;
        var neuf = JSON.stringify(d);
        try { window.sessionStorage.setItem(self._cacheKey(), JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
        if (self._ready && self._state.payload && JSON.stringify(self._state.payload) === neuf) return;
        if (self._bootTimer) { clearTimeout(self._bootTimer); self._bootTimer = null; }
        self._state.payload = d; self._ready = true; self._scheduleRender();
      }).catch(function (e) {
        clearTimeout(guard);
        console.warn('[guide-coureur] donnees CMS indisponibles, contenu de repli', e && e.message);
        if (!self._initialized || self._ready) return;
        if (self._bootTimer) { clearTimeout(self._bootTimer); self._bootTimer = null; }
        self._ready = true; self._render();
      });
    }
    setPayload(o) { if (!this._initialized) { this._pendingPayload = o; return; } this._state.payload = o || {}; this._ready = true; this._scheduleRender(); }
    setLang(l) { if (!this._initialized) { this._pendingLang = l; return; } this._state.lang = l; this._scheduleRender(); }
    flush() { if (this._renderRAF) { cancelAnimationFrame(this._renderRAF); this._renderRAF = null; this._render(); } }
    _scheduleRender() { if (this._renderRAF) return; var s = this; this._renderRAF = requestAnimationFrame(function () { s._renderRAF = null; s._render(); }); }

    _t(k) {
      var L = (this._state.payload || {}).labels;
      if (L && L[k] != null && L[k] !== '') return L[k];
      return (DICT[this._state.lang] || DICT.fr)[k] || DICT.fr[k] || k;
    }
    _v(k) { var p = this._state.payload || {}; return isEmpty(p[k]) ? DEF[k] : p[k]; }
    _list(k) { var v = this._v(k); return Array.isArray(v) ? v.filter(function (x) { return x && x.actif !== false; }) : []; }
    _liens() {
      var p = (this._state.payload || {}).liens || {}, out = {}, k;
      for (k in DEF.liens) out[k] = DEF.liens[k];
      for (k in p) if (!isEmpty(p[k])) out[k] = p[k];
      return out;
    }
    _href(u) {
      var s = isSafeUrl(u, '');
      if (s && s.charAt(0) === '/' && s.charAt(1) !== '/' && this._state.lang === 'en' && s.indexOf('/en/') !== 0) s = '/en' + s;
      return s;
    }
    _src(u) {
      var s = String(u == null ? '' : u).trim();
      if (!s) return '';
      if (/^[\w.-]+\.(jpe?g|png|webp|gif|svg)$/i.test(s)) {
        var b = this.getAttribute('media-base');
        return b ? isSafeUrl(b.replace(/\/?$/, '/') + s, '') : '';
      }
      return isSafeUrl(s, '');
    }
    _btn(u, label, cls, attente, dark) {
      var h = this._href(u);
      if (!h) return attente ? '<span class="gc-btn ' + (dark ? 'gc-btn-off' : 'gc-btn-offl') + '" aria-disabled="true">' + ic('clock') + tx(attente) + '</span>' : '';
      var ext = /^https?:/i.test(h) && h.indexOf(window.location.host) === -1;
      return '<a class="gc-btn ' + cls + '" href="' + escAttr(h) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + tx(label) + ic('arrow') + '</a>';
    }
    _iti(q) {
      if (!q) return '';
      return '<a class="gc-link" href="' + escAttr('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)) + '" target="_blank" rel="noopener">' + ic('nav') + tx(this._t('itineraire')) + '</a>';
    }
    _note(html, warn, title) {
      if (isEmpty(html)) return '';
      return '<div class="gc-note' + (warn ? ' gc-note-w' : '') + '">' + ic(warn ? 'alert' : 'info') + '<div>' + (title ? '<b class="gc-note-t">' + tx(title) + '</b>' : '') + rx(html) + '</div></div>';
    }
    _head(n, key, lead, extra) {
      return '<div class="gc-head"><div class="gc-eyebrow">' + (n ? '<span>' + n + '</span>' : '') + '</div><h2 class="gc-h2">' + tx(this._t(key)) + '</h2>' +
        (isEmpty(lead) ? '' : '<div class="gc-lead">' + rx(lead) + '</div>') + (extra || '') + '</div>';
    }
    _accs(items, pfx) {
      if (!Array.isArray(items) || !items.length) return '';
      if (items.length < 6) return '<div class="gc-acc-w">' + this._acc(items, pfx) + '</div>';
      var h = Math.ceil(items.length / 2);
      return '<div class="gc-acc2">' + this._acc(items.slice(0, h), pfx) + this._acc(items.slice(h), pfx, h) + '</div>';
    }
    _acc(items, pfx, start) {
      if (!Array.isArray(items) || !items.length) return '';
      return '<div class="gc-acc">' + items.map(function (r, i) {
        var id = 'gc-' + pfx + '-' + (i + (start || 0));
        return '<div class="gc-acc-i' + (r.i ? ' has-e' : '') + '"><h4 class="gc-acc-hh"><button type="button" class="gc-acc-h" data-act="acc" aria-expanded="false" aria-controls="' + id + '">' +
          (r.i ? '<span class="gc-acc-e" aria-hidden="true">' + escAttr(r.i) + '</span>' : '') + '<span class="gc-acc-l">' + tx(r.t || r.q) + '</span>' + ic('chev') + '</button></h4>' +
          '<div class="gc-acc-p" id="' + id + '" role="region"><div><div class="gc-acc-c">' + rx(r.c || r.a) + '</div></div></div></div>';
      }).join('') + '</div>';
    }

    _restore() {
      var ids = this._courses().map(function (c) { return c.id; }), fromUrl = '', saved = '';
      try { fromUrl = new URLSearchParams(window.location.search).get('course') || ''; } catch (e) {}
      try { saved = window.localStorage.getItem(STORE_COURSE) || ''; } catch (e) {}
      if (fromUrl && ids.indexOf(fromUrl) !== -1) { this._state.course = fromUrl; this._jump = true; }
      else if (saved && ids.indexOf(saved) !== -1) this._state.course = saved;
    }
    _courses() { return this._list('courses'); }
    _current() {
      var list = this._courses(), id = this._state.course || this._v('courseDefaut');
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return list[0] || null;
    }
    _save(key, val) { try { window.localStorage.setItem(key, val); } catch (e) {} }

    _skeleton() {
      return '<div class="gc-skel" role="status" aria-busy="true" aria-label="' + escAttr(this._t('loading')) + '"></div>';
    }

    _render() {
      if (!this._content) return;
      this._teardown.forEach(function (fn) { try { fn(); } catch (e) {} });
      this._teardown = [];
      this._closeLb(true);
      if (!this._ready) { this._content.innerHTML = this._skeleton(); return; }
      var html = '';
      try {
        html = this._bar() + this._hero() + this._bandeaux('haut') +
          this._secProgramme() + this._secVenir() + this._secAvant() + this._secJour() + this._secRegles() +
          this._secInfos() + this._secApres() + this._secBenevoles() + this._secSupporters() + this._secPartenaires();
      } catch (e) { console.error('[guide-coureur] rendu', e); html = this._bar() + this._hero(); }
      this._content.innerHTML = html;
      this._top = -1;
      this._wire();
      if (this._jump) { this._jump = false; var self = this; setTimeout(function () { self._goTo('gc-jour'); }, 60); }
    }

    _bar() {
      var self = this;
      var links = SECTIONS.map(function (s) {
        return '<a href="#' + s.id + '" data-act="go" data-go="' + s.id + '" aria-current="false">' + ic(s.i) + '<span>' + tx(self._t(s.k)) + '</span></a>';
      }).join('');
      return '<nav class="gc-bar" aria-label="' + escAttr(this._t('navLabel')) + '"><div class="gc-wrap gc-bar-in">' +
        '<a class="gc-brand" href="#gc-haut" data-act="go" data-go="gc-haut"><b>' + tx(this._t('brand')) + '</b><span>' + tx(this._t('brandSub')) + '</span></a>' +
        '<div class="gc-navw"><button type="button" class="gc-nav-fl gc-nav-prev" data-act="navdefil" data-sens="-1" tabindex="-1" aria-label="' + escAttr(this._t('navPrec')) + '"><span>' + ic('chev') + '</span></button>' +
        '<div class="gc-nav">' + links + '</div>' +
        '<button type="button" class="gc-nav-fl gc-nav-next" data-act="navdefil" data-sens="1" tabindex="-1" aria-label="' + escAttr(this._t('navSuiv')) + '"><span>' + ic('chev') + '</span></button></div></div></nav>';
    }

    _hero() {
      var img = this._src(this._v('heroImage')), r = this._v('retrait') || {}, hor = Array.isArray(r.horaires) ? r.horaires : [];
      var start = Date.parse(this._v('premierDepart')), fin = Date.parse(this._v('finWeekend')), now = Date.now(), count = '';
      if (!isNaN(start)) {
        var s0 = new Date(start), n0 = new Date(now);
        var d = Math.round((new Date(s0.getFullYear(), s0.getMonth(), s0.getDate()) - new Date(n0.getFullYear(), n0.getMonth(), n0.getDate())) / 86400000);
        if (d > 1) count = '<b>' + d + '</b><span>' + tx(this._t('daysLeft')) + '</span>';
        else if (d === 1) count = '<b>1</b><span>' + tx(this._t('dayLeft')) + '</span>';
        else if (isNaN(fin) || now < fin) count = '<b class="is-txt">' + tx(this._t('raceWeek')) + '</b>';
      }
      var lignes = hor.map(function (h) { return '<li><span>' + tx(h.j) + '</span><b>' + tx(h.h) + '</b></li>'; }).join('');
      return '<header class="gc-hero" id="gc-haut">' +
        (img ? '<picture>' + (sized(img, 1000) !== img ? '<source media="(max-width:759px)" srcset="' + escAttr(sized(img, 1000)) + '">' : '') +
          '<img class="gc-hero-img" src="' + escAttr(sized(img, 1920)) + '" alt="" fetchpriority="high" decoding="async" style="object-position:' + escAttr(this._v('heroImagePos') || '50% 50%') + '"></picture>' : '') +
        '<div class="gc-wrap gc-hero-in"><div class="gc-hero-c">' +
        '<span class="gc-pill"><span>' + rx(this._v('heroKicker')) + '</span></span>' +
        '<h1 class="gc-h1">' + tx(this._v('heroTitre')) + ' <em>' + tx(this._v('heroAnnee')) + '</em></h1>' +
        '<p class="gc-hero-intro">' + rx(this._v('heroIntro')) + '</p>' +
        '<div class="gc-btns"><a class="gc-btn gc-btn-white" href="#gc-programme" data-act="go" data-go="gc-programme">' + tx(this._t('heroProg')) + ic('arrow') + '</a>' +
        '<a class="gc-btn gc-btn-line" href="#gc-jour" data-act="go" data-go="gc-jour">' + tx(this._t('heroRace')) + '</a></div>' +
        '</div><aside class="gc-hcard">' + (count ? '<div class="gc-count">' + count + '</div>' : '') +
        '<div class="gc-kick">' + tx(this._t('retrait')) + '</div><ul class="gc-hcard-l">' + lignes + '</ul>' +
        (r.lieu ? '<p class="gc-hcard-p">' + ic('pin') + '<span>' + tx(r.lieu) + (r.ville ? ', ' + tx(r.ville) : '') + '</span></p>' : '') +
        '</aside></div></header>';
    }

    _encList(place) { return this._list('encarts').filter(function (e) { return e.place === place; }); }
    _cartes(place) { var self = this; return this._encList(place).filter(function (e) { return e.format === 'carte'; }).map(function (e) { return self._carte(e); }).join(''); }
    _bandeaux(place) { var self = this; return this._encList(place).filter(function (e) { return e.format !== 'carte'; }).map(function (e) { return self._bandeau(e); }).join(''); }

    _bandeau(e) {
      var img = this._src(e.image), logo = this._src(e.logo), motif = this._src(this._v('motif')), edito = e.format === 'edito';
      var bg = !img && motif ? ' style="background-image:url(' + escAttr(motif) + ')"' : '';
      var head = logo ? '<img class="gc-band-logo" src="' + escAttr(sized(logo, 440)) + '" alt="' + escAttr(e.titre || '') + '" loading="lazy" decoding="async">'
        : (e.icone ? '<span class="gc-band-ic">' + ic(e.icone) + '</span>' : '');
      var textes = (e.tag ? '<div class="gc-band-tag">' + tx(e.tag) + '</div>' : '') +
        (logo ? '<h3 class="gc-sr">' + tx(e.titre) + '</h3>' : (e.titre ? '<h3 class="gc-band-t">' + tx(e.titre) + '</h3>' : '')) +
        (isEmpty(e.texte) ? '' : '<div class="gc-band-x">' + rx(e.texte) + '</div>') +
        (e.signature ? '<div class="gc-sign"><b>' + tx(e.signature) + '</b><span>' + tx(e.fonction || '') + '</span></div>' : '');
      var c = img ? head + textes : head + '<div>' + textes + '</div>';
      return '<aside class="gc-band' + (edito ? ' is-edito' : '') + (img ? '' : ' is-motif') + '"' + bg + ' aria-label="' + escAttr(e.titre || e.tag || '') + '">' +
        (img ? '<img class="gc-band-img" src="' + escAttr(sized(img, 1920)) + '" alt="' + escAttr(e.imageAlt || '') + '" loading="lazy" decoding="async" style="object-position:' + escAttr(e.imagePos || '50% 50%') + '">' : '') +
        '<div class="gc-wrap gc-band-in"><div class="gc-band-c">' + c + this._btn(e.lien, e.bouton, img ? 'gc-btn-white' : 'gc-btn-blue', e.attente, true) + '</div></div></aside>';
    }

    _carte(e) {
      var img = this._src(e.image), logo = this._src(e.logo), motif = this._src(this._v('motif'));
      var media = img ? '<div class="gc-card-m' + (logo ? ' has-logo' : '') + '"><img class="gc-card-img" src="' + escAttr(sized(img, 1200)) + '" alt="' + escAttr(e.imageAlt || '') + '" loading="lazy" decoding="async" style="object-position:' + escAttr(e.imagePos || '50% 50%') + '">' +
        (logo ? '<img class="gc-card-logo" src="' + escAttr(sized(logo, 400)) + '" alt="" loading="lazy" decoding="async">' : '') + '</div>'
        : '<div class="gc-card-m is-ic"' + (motif ? ' style="background-image:url(' + escAttr(motif) + ')"' : '') + '>' + ic(e.icone || 'info') + '</div>';
      return '<aside class="gc-card" aria-label="' + escAttr(e.titre || '') + '"><div class="gc-card-b">' + (e.tag ? '<div class="gc-kick">' + tx(e.tag) + '</div>' : '') +
        '<h3 class="gc-card-t">' + tx(e.titre) + '</h3>' + (isEmpty(e.texte) ? '' : '<div class="gc-card-x">' + rx(e.texte) + '</div>') +
        this._btn(e.lien, e.bouton, 'gc-btn-navy', e.attente, false) + '</div>' + media + '</aside>';
    }

    _dayIndex(days) {
      if (this._state.day != null && days[this._state.day]) return this._state.day;
      var t = new Date(), iso = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
      for (var i = 0; i < days.length; i++) if (days[i].date === iso) return i;
      var def = parseInt(this._v('jourDefaut'), 10);
      return days[def] ? def : 0;
    }
    _progList(d) {
      var items = d && Array.isArray(d.items) ? d.items : [], groups = [], g = null;
      items.forEach(function (it) { var l = it.l || ''; if (!g || g.l !== l) { g = { l: l, items: [] }; groups.push(g); } g.items.push(it); });
      return groups.map(function (gr) {
        return '<div class="gc-pgrp">' + (gr.l ? '<div class="gc-pgrp-l">' + ic('pin') + '<span>' + tx(gr.l) + '</span></div>' : '') +
          gr.items.map(function (it) {
            return '<div class="gc-prow' + (it.fort ? ' is-fort' : '') + '"><div class="gc-prow-h">' + tx(it.h) + '</div><div class="gc-prow-t">' + tx(it.t) + (it.note ? ' <em>' + tx(it.note) + '</em>' : '') + '</div></div>';
          }).join('') + '</div>';
      }).join('');
    }
    _secProgramme() {
      var days = this._list('programme');
      if (!days.length) return '';
      var cur = this._dayIndex(days);
      var tabs = days.map(function (d, i) {
        return '<button type="button" role="tab" class="gc-tab" id="gc-tab-' + i + '" aria-controls="gc-prog" aria-selected="' + (i === cur ? 'true' : 'false') + '" tabindex="' + (i === cur ? '0' : '-1') + '" data-act="day" data-i="' + i + '"><span class="gc-tab-l">' + tx(d.jour) + '</span>' + (d.court ? '<span class="gc-tab-s" aria-hidden="true">' + tx(d.court) + '</span>' : '') + '</button>';
      }).join('');
      return '<section class="gc-sec" id="gc-programme" data-spy><div class="gc-wrap">' + this._head('01', 'tProgramme') +
        '<div class="gc-prog-box"><div class="gc-tabs" role="tablist" aria-label="' + escAttr(this._t('jours')) + '">' + tabs + '</div>' +
        '<div class="gc-prog" id="gc-prog" role="tabpanel" aria-labelledby="gc-tab-' + cur + '">' + this._progList(days[cur]) + '</div></div>' +
        this._cartes('programme') + '</div></section>' + this._bandeaux('programme');
    }

    _secVenir() {
      var self = this, L = this._liens(), ter = this._v('ter') || {};
      var adr = this._list('adresses').map(function (a) {
        var corps = Array.isArray(a.lignes) ? '<ul class="gc-adr-ls">' + a.lignes.map(function (x) { return '<li>' + rx(x) + '</li>'; }).join('') + '</ul>'
          : '<p class="gc-adr-l"><b>' + tx(a.l) + '</b>' + (a.v ? '<span>' + tx(a.v) + '</span>' : '') + '</p>';
        return '<div class="gc-adr"><div class="gc-adr-i">' + ic(a.i || 'pin') + '</div><div class="gc-adr-b"><div class="gc-kick">' + tx(a.t) + '</div>' + corps + self._iti(a.q) + '</div></div>';
      }).join('');
      var parks = this._list('parkings').map(function (g) {
        return '<div class="gc-park"><h4 class="gc-park-h">' + tx(g.jour) + '</h4><ul>' + (g.items || []).map(function (p) {
          return '<li class="gc-park-i"><div class="gc-park-n">' + ic('park') + '<span>' + tx(p.n) + '</span></div><ul class="gc-park-d">' + (p.d || []).map(function (x) {
            return '<li>' + ic(x.k === 'arrivee' ? 'bag' : 'flag') + '<span><b>' + tx(x.dist) + '</b> ' + tx(x.z) + '</span><em>' + tx(x.min) + ' ' + tx(self._t('aPied')) + '</em></li>';
          }).join('') + '</ul></li>';
        }).join('') + '</ul></div>';
      }).join('');
      var terHtml = ter.titre ? '<div class="gc-ter"><div class="gc-ter-i">' + ic('train') + '</div><div><h3 class="gc-h3">' + tx(ter.titre) + '</h3><div class="gc-ter-x">' + rx(ter.texte) + '</div>' +
        (Array.isArray(ter.points) && ter.points.length ? '<ul class="gc-ter-p">' + ter.points.map(function (p) { return '<li>' + ic(p.i || 'info') + '<span>' + rx(p.t) + '</span></li>'; }).join('') + '</ul>' : '') + '</div></div>' : '';
      return '<section class="gc-sec gc-alt" id="gc-venir" data-spy><div class="gc-wrap">' + this._head('02', 'tVenir', this._v('venirIntro')) +
        '<h3 class="gc-h4">' + tx(this._t('adresses')) + '</h3><div class="gc-adrs gc-anchor" id="gc-adresses">' + adr + '</div>' +
        '<div class="gc-mt">' + this._note(this._v('circulationAlerte'), true) +
        '<div class="gc-circ"><p>' + rx(this._v('circulationConseil')) + '</p>' + this._btn(L.circulation, this._t('circulation'), 'gc-btn-navy') + '</div></div>' +
        (parks ? '<div class="gc-mt-l"><h3 class="gc-h3 gc-h3-big">' + tx(this._t('parkings')) + '</h3><div class="gc-parks">' + parks + '</div></div>' : '') +
        terHtml + this._cartes('venir') + '</div></section>' + this._bandeaux('venir');
    }

    _affluence() {
      var self = this, list = this._list('affluence'), motif = this._src(this._v('motif'));
      if (!list.length) return '';
      var jours = list.map(function (d) {
        return '<div class="gc-aff-d"><div class="gc-aff-j">' + tx(d.j) + '</div><div>' + (d.c || []).map(function (c) {
          var n = Math.max(1, Math.min(3, parseInt(c.n, 10) || 1));
          return '<div class="gc-aff-r n' + n + '"><span>' + tx(c.de) + ' - ' + tx(c.a) + '</span><span class="gc-aff-bar" aria-hidden="true"><i></i></span><em>' + tx(self._t('n' + n)) + '</em></div>';
        }).join('') + '</div></div>';
      }).join('');
      return '<div class="gc-aff"' + (motif ? ' style="background-image:url(' + escAttr(motif) + ')"' : '') + '><h4 class="gc-aff-t">' + tx(this._t('affluence')) + '</h4>' +
        '<p class="gc-aff-i">' + tx(this._t('affluenceIntro')) + '</p>' + jours + '</div>';
    }

    _secAvant() {
      var r = this._v('retrait') || {}, L = this._liens(), v = this._v('village') || {}, b = this._v('boutique') || {}, self = this;
      var sub = '<nav class="gc-sub" aria-label="' + escAttr(this._t('tAvant')) + '">' + [['gc-retrait', 'subRetrait', 'ticket'], ['gc-village', 'subVillage', 'pin']].map(function (s) {
        return '<a href="#' + s[0] + '" data-act="go" data-go="' + s[0] + '">' + ic(s[2]) + tx(self._t(s[1])) + '</a>';
      }).join('') + '</nav>';
      var hor = (r.horaires || []).map(function (h) { return '<li><span>' + tx(h.j) + '</span><b>' + tx(h.h) + '</b></li>'; }).join('');
      var lieu = '<div class="gc-box"><div class="gc-box-h">' + ic('pin') + '<div><div class="gc-kick">' + tx(this._t('lieuHoraires')) + '</div><p class="gc-box-t">' + tx(r.lieu) + '</p><p class="gc-box-s">' + tx(r.ville || '') + '</p></div></div>' +
        '<ul class="gc-hor">' + hor + '</ul>' + this._iti(r.q) + '</div>';
      var docs = (r.documents || []).map(function (d) { return '<li>' + ic('check') + '<span>' + rx(d) + '</span></li>'; }).join('');
      var lots = (r.lots || []).map(function (l) { return '<div class="gc-lot"><span aria-hidden="true">' + escAttr(l.i || '') + '</span><p>' + rx(l.t) + '</p></div>'; }).join('');
      var expo = Array.isArray(v.exposants) && v.exposants.length ? '<div><h4 class="gc-h4">' + tx(this._t('exposants')) + '</h4><ul class="gc-expo">' + v.exposants.map(function (x) { return '<li>' + tx(x && x.nom ? x.nom : x) + '</li>'; }).join('') + '</ul></div>' : '';
      var bimg = this._src(b.image);
      var shop = (bimg || b.titre) ? '<div class="gc-shop"><div class="gc-shop-b">' + (b.tag ? '<span class="gc-kick">' + tx(b.tag) + '</span>' : '') + '<h4 class="gc-card-t">' + rx(b.titre) + '</h4>' +
        (isEmpty(b.texte) ? '' : '<div class="gc-card-x">' + rx(b.texte) + '</div>') + this._btn(b.lien, b.bouton, 'gc-btn-white', '', true) + '</div>' +
        (bimg ? '<div class="gc-shop-m"><img src="' + escAttr(sized(bimg, 900)) + '" alt="' + escAttr(b.imageAlt || '') + '" loading="lazy" decoding="async"></div>' : '') + '</div>' : '';
      return '<section class="gc-sec" id="gc-avant" data-spy><div class="gc-wrap">' + this._head('03', 'tAvant', '', sub) +
        '<div class="gc-anchor" id="gc-retrait"><h3 class="gc-h3 gc-h3-big">' + tx(this._t('subRetrait')) + '</h3>' +
        '<div class="gc-grid2"><div class="gc-stack">' + lieu + this._note(r.alerte, true) + '</div>' + this._affluence() + '</div>' +
        '<div class="gc-grid2 gc-mt"><div class="gc-stack"><h4 class="gc-h4">' + tx(this._t('documents')) + '</h4><ul class="gc-docs">' + docs + '</ul>' + this._btn(L.espaceCoureur, this._t('espaceCoureur'), 'gc-btn-navy') + '</div>' +
        '<div class="gc-stack">' + this._note(r.galopades, false, this._t('galopades')) + this._note(r.rappel, true, this._t('rappel')) + '</div></div>' +
        (lots ? '<div class="gc-mt"><h4 class="gc-h4">' + tx(this._t('lots')) + '</h4><p class="gc-small">' + tx(this._t('lotsIntro')) + '</p><div class="gc-lots">' + lots + '</div></div>' : '') +
        (Array.isArray(r.faq) && r.faq.length ? '<div class="gc-mt gc-acc-w"><h4 class="gc-h4">' + tx(this._t('faq')) + '</h4>' + this._acc(r.faq, 'rf') + '</div>' : '') + '</div>' +
        '<div class="gc-anchor gc-mt-l" id="gc-village"><h3 class="gc-h3 gc-h3-big">' + tx(v.titre || this._t('subVillage')) + '</h3>' +
        '<div class="gc-stack">' + (isEmpty(v.texte) ? '' : '<p class="gc-p">' + rx(v.texte) + '</p>') + expo + '</div>' + shop + '</div>' +
        this._cartes('avant') + '</div></section>' + this._bandeaux('avant');
    }

    _secJour() {
      var list = this._courses(), cur = this._current();
      if (!list.length || !cur) return '';
      var groups = [], seen = {};
      list.forEach(function (c) { var k = c.jour || ''; if (!seen[k]) { seen[k] = { label: k, items: [] }; groups.push(seen[k]); } seen[k].items.push(c); });
      var picker = '<div class="gc-pick" role="group" aria-label="' + escAttr(this._t('choisir')) + '">' + groups.map(function (g) {
        return '<div class="gc-pick-g"><div class="gc-pick-d">' + tx(g.label) + '</div><div class="gc-pick-r">' + g.items.map(function (c) {
          return '<button type="button" class="gc-race" data-act="race" data-course="' + escAttr(c.id) + '" aria-pressed="' + (c.id === cur.id ? 'true' : 'false') + '" aria-controls="gc-rp"><b>' + tx(c.label) + '</b><span>' + tx(c.heure) + '</span></button>';
        }).join('') + '</div></div>';
      }).join('') + '</div>';
      return '<section class="gc-sec gc-alt" id="gc-jour" data-spy><div class="gc-wrap">' + this._head('04', 'tJour', this._t('jourIntro')) +
        picker + '<div id="gc-rp" aria-live="polite">' + this._racePanel(cur) + '</div>' + this._cartes('jour') + '</div></section>' + this._bandeaux('jour');
    }

    _racePanel(c) {
      var L = this._liens(), out = '', k;
      var facts = (c.faits || []).map(function (f) { return '<div class="gc-fact">' + ic(f.i || 'info') + '<div><div class="gc-fact-k">' + tx(f.k) + '</div><div class="gc-fact-v">' + rx(f.v) + '</div></div></div>'; }).join('');
      out += '<div class="gc-rp"><div class="gc-rp-head"><div><div class="gc-kick">' + tx(c.jour) + '</div><h3 class="gc-rp-t">' + tx(c.titre || c.label) + '</h3>' + (c.sous ? '<p class="gc-rp-s">' + tx(c.sous) + '</p>' : '') + '</div>' +
        this._btn(L.carte, this._t('carte'), 'gc-btn-blue', this._t('bientot'), false) + '</div><div class="gc-facts">' + facts + '</div>';
      if (Array.isArray(c.departs) && c.departs.length) {
        out += '<div class="gc-mt"><h4 class="gc-h4">' + tx(this._t('departs')) + '</h4><div class="gc-deps">' + c.departs.map(function (d) {
          return '<div class="gc-dep"><b>' + tx(d.h) + '</b><div><strong>' + tx(d.t) + '</strong><span>' + tx(d.d) + (d.n ? ' · ' + tx(d.n) : '') + '</span></div></div>';
        }).join('') + '</div></div>';
      }
      if (!isEmpty(c.note)) out += '<div class="gc-mt-s">' + this._note(c.note) + '</div>';
      if (!isEmpty(c.materiel)) out += '<div class="gc-mt-s">' + this._note(c.materiel, false, this._t('materiel')) + '</div>';
      if (c.consignes) {
        k = this._v('consignesCourse') || {};
        out += '<div class="gc-cons"><div class="gc-cons-h">' + ic('bag') + '<div><div class="gc-kick">' + tx(this._t('consignes')) + '</div><b>' + tx(this._t('ouverture')) + ' ' + tx(k.ouverture) + '</b></div></div>' +
          '<div class="gc-cons-b"><p>' + rx(k.texte) + '</p>' + (Array.isArray(k.points) ? '<ul>' + k.points.map(function (p) { return '<li>' + ic('check') + '<span>' + rx(p) + '</span></li>'; }).join('') + '</ul>' : '') + '</div></div>';
      }
      if (c.sas) out += this._sas(c);
      return out + '</div>';
    }

    _sas(c) {
      var s = c.sas || {}, plan = this._src(s.plan), titre = this._t('plan') + ' : ' + (c.titre || c.label);
      var tl = '<div class="gc-tl"><div><span>' + tx(this._t('fermeture')) + '</span><b>' + tx(s.fermeture) + '</b></div><div><span>' + tx(this._t('fermetureElite')) + '</span><b>' + tx(s.fermetureElite) + '</b></div><div><span>' + tx(this._t('departLbl')) + '</span><b>' + tx(s.depart) + '</b></div></div>';
      var left = '<div class="gc-stack"><p class="gc-p">' + rx(s.intro) + '</p>' + (isEmpty(s.elite) ? '' : '<p class="gc-p">' + rx(s.elite) + '</p>') + tl +
        '<p class="gc-small">' + (isEmpty(s.departNote) ? '' : rx(s.departNote) + ' ') + '<strong>' + tx(this._t('anticipez')) + '</strong></p>' + this._acc(this._list('sasFaq'), 'sf-' + c.id) + '</div>';
      var right = plan ? '<figure class="gc-fig"><button type="button" class="gc-fig-b" data-act="zoom" data-src="' + escAttr(plan) + '" data-alt="' + escAttr(titre) + '" aria-label="' + escAttr(this._t('agrandir')) + '"><img src="' + escAttr(sized(plan, 1400)) + '" alt="' + escAttr(titre) + '" loading="lazy" decoding="async"><span class="gc-fig-z">' + ic('zoom') + tx(this._t('agrandir')) + '</span></button><figcaption>' + tx(this._t('plan')) + '</figcaption></figure>' : '';
      return '<div class="gc-mt-l"><h4 class="gc-h3">' + tx(this._t('zoneDepart')) + ' ' + tx(c.de || c.label) + '</h4><div class="gc-grid2' + (plan ? '' : ' is-solo') + '">' + left + right + '</div>' +
        (Array.isArray(s.meneurs) && s.meneurs.length ? '<div class="gc-mt"><h4 class="gc-h4">' + tx(this._t('meneurs')) + '</h4><p class="gc-small">' + tx(this._t('meneursIntro')) + '</p><div class="gc-chips">' + s.meneurs.map(function (m) { return '<span class="gc-chip">' + tx(m) + '</span>'; }).join('') + '</div></div>' : '') + '</div>';
    }

    _secRegles() {
      var L = this._liens();
      var dq = this._list('disqualif').map(function (x) { return '<li>' + ic('ban') + '<span>' + rx(x) + '</span></li>'; }).join('');
      var lims = this._list('tempsLimites').map(function (t) { return '<div class="gc-lim"><span>' + tx(t.c) + '</span><b>' + tx(t.t) + '</b></div>'; }).join('');
      return '<section class="gc-sec" id="gc-regles" data-spy><div class="gc-wrap">' + this._head('05', 'tRegles') +
        '<div class="gc-rule">' + ic('doc') + '<div><b>' + tx(this._t('reglement')) + '</b><p>' + tx(this._t('reglementTxt')) + '</p></div>' + this._btn(L.reglement, this._t('reglementBtn'), 'gc-btn-navy') + '</div>' +
        '<div class="gc-grid2 gc-mt-l"><div><h3 class="gc-h3">' + tx(this._t('disqualif')) + '</h3><p class="gc-p">' + rx(this._v('reglesIntro')) + '</p><ul class="gc-dq">' + dq + '</ul></div>' +
        '<div><h3 class="gc-h3">' + tx(this._t('tempsLimites')) + '</h3><p class="gc-p">' + tx(this._t('tempsIntro')) + '</p><div class="gc-lims">' + lims + '</div>' +
        this._note(this._v('veloBalai'), true) + '<div class="gc-rt gc-hd">' + rx(this._v('horsDelai')) + '</div></div></div>' +
        this._cartes('regles') + '</div></section>' + this._bandeaux('regles');
    }

    _secInfos() {
      return '<section class="gc-sec gc-alt" id="gc-infos" data-spy><div class="gc-wrap">' + this._head('06', 'tInfos') +
        this._accs(this._list('infos'), 'in') + this._cartes('infos') + '</div></section>' + this._bandeaux('infos');
    }

    _secApres() {
      var pods = this._list('podiums').map(function (p) {
        return '<div class="gc-pod"><div class="gc-kick">' + tx(p.jour) + '</div><ul>' + (p.items || []).map(function (x) { return '<li><b>' + tx(x.h) + '</b><span>' + tx(x.t) + '</span></li>'; }).join('') + '</ul>' +
          (p.lieu ? '<p>' + ic('pin') + '<span>' + tx(p.lieu) + '</span></p>' : '') + '</div>';
      }).join('');
      return '<section class="gc-sec" id="gc-apres" data-spy><div class="gc-wrap">' + this._head('07', 'tApres') +
        this._accs(this._list('apres'), 'ap') +
        '<div class="gc-mt-l"><h3 class="gc-h3 gc-h3-big">' + tx(this._t('protocole')) + '</h3><div class="gc-rt gc-acc-w">' + rx(this._v('protocole')) + '</div>' +
        (pods ? '<h4 class="gc-h4 gc-mt">' + tx(this._t('podiums')) + '</h4><div class="gc-pods">' + pods + '</div>' : '') + '</div>' +
        this._cartes('apres') + '</div></section>' + this._bandeaux('apres');
    }

    _secBenevoles() {
      var b = this._v('benevoles') || {}, L = this._liens(), img = this._src(b.image), motif = this._src(this._v('motif'));
      var side = img ? '<div class="gc-bene-img"><img src="' + escAttr(sized(img, 1000)) + '" alt="' + escAttr(b.imageAlt || '') + '" loading="lazy" decoding="async"></div>'
        : (b.chiffre ? '<div class="gc-stat"' + (motif ? ' style="background-image:url(' + escAttr(motif) + ')"' : '') + '><b>' + tx(b.chiffre) + '</b><span>' + tx(b.chiffreTexte) + '</span></div>' : '');
      return '<section class="gc-sec gc-alt" id="gc-benevoles" data-spy><div class="gc-wrap">' + this._head('08', 'tBenevoles') +
        '<div class="gc-bene"><div><div class="gc-rt">' + rx(b.texte) + '</div>' + this._btn(L.benevoles, this._t('devenir'), 'gc-btn-navy') + '</div>' + side + '</div>' +
        this._cartes('benevoles') + '</div></section>' + this._bandeaux('benevoles');
    }

    _secSupporters() {
      var L = this._liens(), d = this._v('direct') || {};
      var btns = '<div class="gc-sup-btns"><a class="gc-btn gc-btn-navy" href="#gc-adresses" data-act="go" data-go="gc-adresses">' + tx(this._t('fanzones')) + ic('arrow') + '</a>' + this._btn(L.circulation, this._t('circulation'), 'gc-btn-blue') + '</div>';
      return '<section class="gc-sec" id="gc-supporters" data-spy><div class="gc-wrap">' + this._head('09', 'tSupporters', this._v('supportersIntro'), btns) +
        this._cartes('supporters') +
        (d.titre ? '<div class="gc-live"><div class="gc-live-i">' + ic('mic') + '</div><div><h3 class="gc-h3">' + tx(d.titre) + '</h3><div class="gc-rt">' + rx(d.texte) + '</div></div></div>' : '') +
        '<div class="gc-mt-l"><h3 class="gc-h3 gc-h3-big">' + tx(this._v('conduiteTitre')) + '</h3><p class="gc-p">' + rx(this._v('conduiteIntro')) + '</p>' +
        '<div class="gc-mt-s">' + this._accs(this._list('conduite'), 'cd') + '</div></div></div></section>' + this._bandeaux('supporters');
    }

    _secPartenaires() {
      var self = this, list = this._list('logos'), motif = this._src(this._v('motif'));
      if (!list.length) return '';
      var groups = [], idx = {};
      list.forEach(function (l) { var k = l.groupe || ''; if (!idx[k]) { idx[k] = { nom: k, items: [] }; groups.push(idx[k]); } idx[k].items.push(l); });
      var body = groups.map(function (g, gi) {
        return '<div class="gc-pg' + (gi === 0 ? ' is-main' : '') + '"><div class="gc-pg-l">' + tx(g.nom) + '</div><div class="gc-pg-r">' + g.items.map(function (l) {
          var logo = self._src(l.logo), h = self._href(l.lien);
          var inner = logo ? '<img src="' + escAttr(sized(logo, 500)) + '" alt="' + escAttr(l.nom) + '" loading="lazy" decoding="async">' : '<span>' + tx(l.nom) + '</span>';
          return h ? '<a class="gc-logo" href="' + escAttr(h) + '" target="_blank" rel="noopener" aria-label="' + escAttr(l.nom) + '">' + inner + '</a>' : '<div class="gc-logo">' + inner + '</div>';
        }).join('') + '</div></div>';
      }).join('');
      return '<section class="gc-sec gc-partners" id="gc-partenaires"' + (motif ? ' style="--gc-motif:url(' + escAttr(motif) + ')"' : '') + '><div class="gc-wrap">' + this._head('', 'tPartenaires') + body + '</div></section>';
    }

    _on(el, ev, fn, o) { if (!el) return; el.addEventListener(ev, fn, o); this._teardown.push(function () { el.removeEventListener(ev, fn, o); }); }

    _headerBottom() {
      var cands = [document.getElementById('SITE_HEADER'), document.getElementById('SITE_HEADER_WRAPPER'), document.querySelector('header:not(.gc-hero)')];
      for (var k = 0; k < cands.length; k++) {
        var h = cands[k];
        if (!h || this.contains(h)) continue;
        try {
          var el = h, fixed = false;
          for (var i = 0; i < 3 && el; i++) { var p = window.getComputedStyle(el).position; if (p === 'fixed' || p === 'sticky') { fixed = true; break; } el = el.parentElement; }
          if (!fixed) continue;
          var r = h.getBoundingClientRect();
          if (r.bottom > 0 && r.bottom < 240) return Math.round(r.bottom);
        } catch (e) {}
      }
      return 0;
    }
    _barH() { var b = this._content && this._content.querySelector('.gc-bar'); return b ? b.offsetHeight : 0; }

    _goTo(id) {
      var el = this._content && this._content.querySelector('#' + id);
      if (!el) return;
      var y = el.getBoundingClientRect().top + window.pageYOffset - this._headerBottom();
      if (id !== 'gc-haut') {
        var pad = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
        y = y - this._barH() + Math.max(0, pad - 36) - (pad ? 0 : 20);
      }
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      try { window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, y)); }
    }

    _paintProg() {
      var root = this._content, days = this._list('programme'), cur = this._dayIndex(days);
      [].forEach.call(root.querySelectorAll('#gc-programme [role="tab"]'), function (b, i) { var on = i === cur; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.setAttribute('tabindex', on ? '0' : '-1'); });
      var p = root.querySelector('#gc-prog');
      if (p) { p.innerHTML = this._progList(days[cur]); p.setAttribute('aria-labelledby', 'gc-tab-' + cur); }
    }
    _paintRace() {
      var root = this._content, c = this._current();
      if (!c) return;
      [].forEach.call(root.querySelectorAll('.gc-race'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-course') === c.id ? 'true' : 'false'); });
      var p = root.querySelector('#gc-rp');
      if (p) p.innerHTML = this._racePanel(c);
    }

    _openLb(src, alt) {
      var self = this;
      this._closeLb(true);
      if (!src) return;
      var d = document.createElement('div');
      d.className = 'gc-lb'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', alt || '');
      d.innerHTML = '<button type="button" class="gc-lb-x" aria-label="' + escAttr(this._t('fermer')) + '">' + ic('x') + '</button><div class="gc-lb-in"><img src="' + escAttr(src) + '" alt="' + escAttr(alt || '') + '"></div>' +
        '<a class="gc-lb-o" href="' + escAttr(src) + '" target="_blank" rel="noopener">' + tx(this._t('ouvrirImage')) + ic('ext') + '</a>';
      d.addEventListener('click', function (e) { if (e.target === d || (e.target.closest && e.target.closest('.gc-lb-x'))) self._closeLb(); });
      document.body.appendChild(d);
      this._lb = d; this._lbBack = document.activeElement;
      var x = d.querySelector('.gc-lb-x'); if (x) x.focus();
    }
    _closeLb(silent) {
      if (!this._lb) return;
      if (this._lb.parentNode) this._lb.parentNode.removeChild(this._lb);
      this._lb = null;
      if (!silent && this._lbBack && this._lbBack.focus) { try { this._lbBack.focus({ preventScroll: true }); } catch (e) {} }
      this._lbBack = null;
    }

    _fitNav() {
      var root = this._content, bar = root && root.querySelector('.gc-bar'), nav = bar && bar.querySelector('.gc-nav');
      if (!nav) return;
      var deborde = function () { return nav.scrollWidth > nav.clientWidth + 1; };
      bar.classList.remove('no-ic', 'no-brand', 'is-fit');
      if (deborde()) bar.classList.add('no-ic');
      if (deborde()) bar.classList.add('no-brand');
      if (!deborde()) bar.classList.add('is-fit');
      this._navEdges();
    }
    _navEdges() {
      var root = this._content, w = root && root.querySelector('.gc-navw'), nav = w && w.querySelector('.gc-nav');
      if (!nav) return;
      var max = nav.scrollWidth - nav.clientWidth;
      w.classList.toggle('can-prev', max > 1 && nav.scrollLeft > 2);
      w.classList.toggle('can-next', max > 1 && nav.scrollLeft < max - 2);
    }
    _navDefil(sens) {
      var nav = this._content && this._content.querySelector('.gc-nav');
      if (!nav) return;
      var pas = Math.max(160, nav.clientWidth * 0.7) * sens;
      try { nav.scrollBy({ left: pas, behavior: 'smooth' }); } catch (e) { nav.scrollLeft += pas; }
    }

    _spy() {
      var root = this._content, host = this._root;
      if (!root || !host) return;
      var top = this._headerBottom();
      if (top !== this._top) { this._top = top; host.style.setProperty('--gc-top', top + 'px'); }
      var line = top + this._barH() + 96, cur = '';
      var secs = root.querySelectorAll('[data-spy]');
      for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top <= line) cur = secs[i].id; }
      var fin = root.querySelector('#gc-partenaires');
      if (fin && fin.getBoundingClientRect().top <= line) cur = '';
      if (cur !== this._activeId) {
        this._activeId = cur;
        var links = root.querySelectorAll('.gc-nav a[data-go]'), nav = root.querySelector('.gc-nav');
        for (var j = 0; j < links.length; j++) {
          var on = links[j].getAttribute('data-go') === cur;
          links[j].setAttribute('aria-current', on ? 'true' : 'false');
          if (on && nav && nav.scrollWidth > nav.clientWidth + 2) {
            var l = links[j], left = l.offsetLeft - (nav.clientWidth - l.offsetWidth) / 2;
            try { nav.scrollTo({ left: left, behavior: 'smooth' }); } catch (e) { nav.scrollLeft = left; }
          }
        }
      }
      var btn = host.querySelector('.gc-top'), rr = root.getBoundingClientRect();
      if (btn) btn.classList.toggle('on', rr.top < -800 && rr.bottom > window.innerHeight * 0.5);
    }

    _wire() {
      var self = this, root = this._content, host = this._root;
      this._activeId = null;
      this._on(document, 'click', function (e) {
        var t = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
        if (!t || !host.contains(t)) return;
        var act = t.getAttribute('data-act');
        if (act === 'go') { e.preventDefault(); self._goTo(t.getAttribute('data-go')); }
        else if (act === 'top') {
          e.preventDefault();
          var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
          try { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
        }
        else if (act === 'day') { self._state.day = parseInt(t.getAttribute('data-i'), 10) || 0; self._paintProg(); }
        else if (act === 'race') { var id = t.getAttribute('data-course'); self._state.course = id; self._save(STORE_COURSE, id); self._paintRace(); }
        else if (act === 'acc') {
          var it = t.closest('.gc-acc-i'), open = t.getAttribute('aria-expanded') !== 'true';
          t.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (it) it.classList.toggle('is-open', open);
        }
        else if (act === 'zoom') { e.preventDefault(); self._openLb(t.getAttribute('data-src'), t.getAttribute('data-alt')); }
        else if (act === 'navdefil') { e.preventDefault(); self._navDefil(parseInt(t.getAttribute('data-sens'), 10) || 1); }
      }, true);
      var nav = root.querySelector('.gc-nav');
      if (nav) {
        this._on(nav, 'scroll', function () { self._navEdges(); }, { passive: true });
        this._on(nav, 'wheel', function (e) {
          var max = nav.scrollWidth - nav.clientWidth, d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          if (max <= 1 || !d) return;
          if ((d < 0 && nav.scrollLeft <= 0) || (d > 0 && nav.scrollLeft >= max - 1)) return;
          e.preventDefault();
          nav.scrollLeft += d * (e.deltaMode === 1 ? 32 : 1);
        }, { passive: false });
      }
      var refit = function () { self._fitNav(); };
      this._on(window, 'resize', refit, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (self._initialized) self._fitNav(); });
      this._fitNav();
      this._on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && self._lb) { self._closeLb(); return; }
        var t = e.target;
        if (!t || !t.getAttribute || t.getAttribute('role') !== 'tab' || !root.contains(t)) return;
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var tabs = [].slice.call(t.parentNode.querySelectorAll('[role="tab"]')), i = tabs.indexOf(t);
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); n.click(); }
      }, true);
      var onScroll = function () {
        if (self._scrollRAF) return;
        self._scrollRAF = requestAnimationFrame(function () { self._scrollRAF = null; self._spy(); });
      };
      this._on(window, 'scroll', onScroll, { passive: true });
      this._on(window, 'resize', onScroll, { passive: true });
      this._spy();
    }
  }

  customElements.define('guide-coureur', GuideCoureur);
})();
