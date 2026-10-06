// Generates the simple footer pages from one template. Usage: node tools/build-pages.mjs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const pages = {
  "contact.html": ["Contact", "Contactez l’équipe BeautéCalendrier.", `
    <p>Une question sur le site, une suggestion ou une demande de partenariat ? Écrivez-nous à l’adresse suivante :</p>
    <p><a href="mailto:contact@beautecalendrier.info">contact@beautecalendrier.info</a></p>
    <p>Pour toute question concernant une commande (suivi, livraison, retour, remboursement), merci de contacter directement le service client du marchand auprès duquel vous avez passé commande : BeautéCalendrier ne vend aucun produit et n’a pas accès à vos commandes.</p>`],
  "confidentialite.html": ["Politique de confidentialité", "Comment BeautéCalendrier traite vos données.", `
    <h2>Données collectées</h2>
    <p>BeautéCalendrier ne propose ni compte utilisateur ni formulaire. Le site utilise toutefois le pixel Meta (Facebook) pour mesurer son audience et l’efficacité de ses publicités.</p>
    <h2 id="cookies">Pixel Meta et cookies</h2>
    <p>Le pixel Meta n’est chargé qu’après votre accord, donné via le bandeau affiché lors de votre première visite. Votre choix est conservé six mois ; vous pouvez le modifier à tout moment en cliquant sur « Gérer les cookies » en bas de chaque page.</p>
    <p>Si vous l’acceptez, le pixel Meta peut déposer des cookies et transmettre à Meta Platforms Ireland Ltd. des informations techniques (pages consultées, adresse IP, type de navigateur, identifiants de cookies). Meta peut associer ces données à votre compte Facebook ou Instagram. Pour en savoir plus et gérer vos préférences publicitaires, consultez la <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener">politique de confidentialité de Meta</a> et les <a href="https://www.facebook.com/adpreferences/" target="_blank" rel="noopener">paramètres publicitaires de votre compte</a>.</p>
    <h2>Services tiers</h2>
    <p>Les polices de caractères sont chargées depuis Google Fonts ; votre adresse IP est alors transmise à Google pour l’affichage. Les boutons « Découvrir le produit » vous redirigent vers un site marchand partenaire, dont la politique de confidentialité s’applique dès que vous le consultez.</p>
    <h2>Liens d’affiliation</h2>
    <p>Certains liens sont des liens d’affiliation. Le marchand peut déposer un cookie permettant d’attribuer une éventuelle commande à BeautéCalendrier, conformément à sa propre politique.</p>
    <h2>Vos droits</h2>
    <p>Pour toute question relative à vos données, écrivez-nous à <a href="mailto:contact@beautecalendrier.info">contact@beautecalendrier.info</a>.</p>`],
  "conditions.html": ["Conditions générales", "Conditions d’utilisation du site BeautéCalendrier.", `
    <h2>Objet du site</h2>
    <p>BeautéCalendrier est un site éditorial indépendant qui présente des calendriers de l’Avent beauté. Il ne vend aucun produit : les achats sont réalisés sur le site des marchands partenaires, selon leurs propres conditions générales de vente.</p>
    <h2>Indépendance</h2>
    <p>BeautéCalendrier n’est pas affilié, sponsorisé ou officiellement associé à L’Oréal Paris. Les marques citées appartiennent à leurs propriétaires respectifs et sont utilisées uniquement pour désigner les produits présentés.</p>
    <h2>Informations et visuels</h2>
    <p>Les informations sont fournies à titre indicatif et peuvent évoluer (contenu, prix, disponibilité). Les visuels du site sont des illustrations ; seule la fiche produit du marchand fait foi.</p>
    <h2>Rémunération</h2>
    <p>Certains liens sont des liens d’affiliation : BeautéCalendrier peut percevoir une commission sur les achats effectués, sans surcoût pour vous.</p>`],
  "livraison.html": ["Livraison", "Informations sur la livraison des commandes.", `
    <p>Les commandes passées via nos liens sont expédiées par le marchand partenaire. Les modes de livraison, les tarifs et les délais sont indiqués sur son site au moment de la commande.</p>
    <p>Pour recevoir votre calendrier de l’Avent avant le 1<sup>er</sup> décembre, nous vous conseillons de commander le plus tôt possible : les stocks des éditions limitées s’épuisent souvent rapidement.</p>
    <p>Pour le suivi d’un colis, contactez directement le service client du marchand.</p>`],
  "retours.html": ["Retours", "Informations sur les retours et remboursements.", `
    <p>Les retours et remboursements sont gérés par le marchand auprès duquel vous avez passé commande, selon ses conditions générales de vente.</p>
    <p>En règle générale, la vente à distance en France ouvre droit à un délai de rétractation de 14 jours ; certains produits cosmétiques descellés peuvent toutefois en être exclus pour des raisons d’hygiène. Vérifiez les conditions précises sur le site du marchand avant de valider votre achat.</p>`],
};

const tpl = (file, title, desc, body) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | BeautéCalendrier</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://beautecalendrier.info/${file}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <script src="assets/consent.js" defer></script>
</head>
<body class="page-legal">
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html" aria-label="BeautéCalendrier, retour à l’accueil">
        <img class="logo-icon" src="assets/favicon.svg" alt="" width="44" height="44" style="border-radius:10px">
        <span class="logo-text"><span class="logo-name">BeautéCalendrier</span><span class="logo-tag">Des surprises beauté chaque jour</span></span>
      </a>
      <a class="btn btn-primary btn-sm legal-back" href="index.html">← Retour à l’accueil</a>
    </div>
  </header>
  <main class="legal container">
    <h1>${title}</h1>
    ${body.trim()}
  </main>
  <footer class="site-footer">
    <div class="container footer-legal">
      <p>BeautéCalendrier est un site indépendant dédié aux calendriers de l’Avent beauté. Ce site n’est pas affilié, sponsorisé ou officiellement associé à L’Oréal Paris.</p>
      <p><a href="contact.html">Contact</a> · <a href="confidentialite.html">Confidentialité</a> · <a href="conditions.html">Conditions générales</a> · <a href="livraison.html">Livraison</a> · <a href="retours.html">Retours</a> · <a href="confidentialite.html#cookies" data-cookie-settings>Gérer les cookies</a></p>
    </div>
  </footer>
</body>
</html>
`;
for (const [file, [title, desc, body]] of Object.entries(pages)) writeFileSync(join(ROOT, file), tpl(file, title, desc, body));
console.log("Pages:", Object.keys(pages).join(", "));
