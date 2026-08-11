# Budget Kill Switch

This folder contains the automated budget kill switch for the Google Cloud project `constantia-agency`.

## What it does

- listens to Cloud Billing budget Pub/Sub notifications on `projects/constantia-agency/topics/budget-kill-switch`
- checks the current budget notification payload
- disables billing for `constantia-agency` when the configured threshold is reached

The live function currently used for this flow is the 1st gen function:

- `budget-kill-switch-gen1`

## Current live configuration

- Billing account: `$BILLING_ACCOUNT_ID`
- Project: `constantia-agency`
- Pub/Sub topic: `budget-kill-switch`
- Trigger threshold: `0.9` (`90%` of budget)
- Runtime service account: `budget-kill-switch@constantia-agency.iam.gserviceaccount.com`

## Files

- [index.js](ops/budget-kill-switch/index.js): function logic
- [package.json](ops/budget-kill-switch/package.json): function dependencies

## Re-enable billing after shutdown

If the kill switch disables billing, the site and other paid resources in the project can stop working until billing is reattached.

### Console path

1. Open the Google Cloud Billing page for the project:
   - [Billing Overview](https://console.cloud.google.com/billing/linkedaccount?project=constantia-agency)
2. Select `constantia-agency`.
3. Click `Manage billing account`.
4. Re-link the project to billing account `$BILLING_ACCOUNT_ID`, or to the replacement billing account you want to use.
5. Confirm the billing link is active again.
6. Check Hosting, Storage, and any other paid services to make sure they resume normally.

### CLI path

```powershell
$g='C:\Users\Storm\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'
& $g beta billing projects link constantia-agency --billing-account=$BILLING_ACCOUNT_ID
```

If `beta` is unavailable in your local CLI, use the Billing page in the Google Cloud console instead.

### Verification after re-enable

Run:

```powershell
$g='C:\Users\Storm\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'
& $g auth print-access-token | Out-Null
$token = & $g auth print-access-token
Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri 'https://cloudbilling.googleapis.com/v1/projects/constantia-agency/billingInfo' | ConvertTo-Json -Depth 10
```

Expected result:

- `"billingEnabled": true`
- `"billingAccountName": "billingAccounts/$BILLING_ACCOUNT_ID"` (or your current replacement account)

## Important behavior

- This is not a perfect hard cap. Budget notifications can lag.
- A `90%` trigger is safer than waiting for `100%`.
- If you want to test safely, set `SIMULATION_MODE=true` before redeploying the function.
