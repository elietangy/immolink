# Brancher ImmoLink à Supabase

L'interface fonctionne en mode démonstration sans compte Supabase. Une fois branchée, elle affiche les annonces publiées, envoie les nouvelles annonces en attente de vérification et ouvre WhatsApp pour contacter le déposant.

## Configuration

1. Créez un projet Supabase et ouvrez **SQL Editor**.
2. Exécutez le contenu de `supabase.sql`.
3. Dans **Project Settings → API**, copiez l'URL du projet et la clé `anon`/publishable.
4. Collez-les dans `supabase-config.js` :

   ```js
   window.IMMOLINK_SUPABASE_URL = "https://votre-projet.supabase.co";
   window.IMMOLINK_SUPABASE_ANON_KEY = "votre-cle-publique";
   ```

5. Servez le dossier avec un hébergeur web statique et rechargez la page.

La clé `anon`/publishable est conçue pour être utilisée dans le navigateur. **N'insérez jamais une clé `service_role` ou un secret Supabase dans ce site.**

## Validation des annonces

Les soumissions démarrent avec le statut `pending` et ne sont pas visibles publiquement. Après contrôle, publiez une annonce depuis l'éditeur SQL Supabase :

```sql
update public.listings
set status = 'published'
where id = 'UUID_DE_L_ANNONCE'
  and status = 'pending';
```

Le numéro WhatsApp apparaît sur une annonce publiée parce que le déposant a donné son accord explicite dans le formulaire. Les coordonnées des exemples de démonstration ne sont pas réelles.

## Avant une ouverture publique


L'insertion anonyme convient à un prototype avec modération, mais ne limite pas à elle seule les soumissions automatisées. Avant d'ouvrir le formulaire au grand public, ajoutez un CAPTCHA ou une Edge Function avec limitation de débit et journalisation. Configurez aussi les politiques de sauvegarde/rétention, la politique de confidentialité et les tarifs réels des annonces sponsorisées.

Les paiements mobiles ne sont pas encore connectés. Un fournisseur disponible en Côte d'Ivoire et ses identifiants marchands seront nécessaires pour encaisser les annonces sponsorisées.
