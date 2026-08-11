'use strict'

const { CloudBillingClient } = require('@google-cloud/billing')

const billing = new CloudBillingClient()

function tryParseJson(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function decodeBudgetPayload(encoded, logLabel) {
  if (!encoded) return {}

  const decoded = Buffer.from(encoded, 'base64').toString('utf8')
  const parsed = tryParseJson(decoded)
  if (parsed && typeof parsed === 'object') {
    return parsed
  }

  const nestedDecoded = Buffer.from(decoded, 'base64').toString('utf8')
  const nestedParsed = tryParseJson(nestedDecoded)
  if (nestedParsed && typeof nestedParsed === 'object') {
    return nestedParsed
  }

  console.error(`${logLabel} payload could not be parsed as JSON.`, { decoded })
  return {}
}

function parseBudgetNotification(cloudEvent) {
  const encoded = cloudEvent?.data?.message?.data
  return decodeBudgetPayload(encoded, 'Budget notification')
}

function parseLegacyPubSubNotification(pubSubEvent) {
  const encoded = pubSubEvent?.data
  return decodeBudgetPayload(encoded, 'Legacy Pub/Sub budget notification')
}

function shouldDisableBilling(payload) {
  const threshold = Number(payload.alertThresholdExceeded ?? 0)
  const costAmount = Number(payload.costAmount ?? 0)
  const budgetAmount = Number(payload.budgetAmount ?? 0)
  const triggerPercent = Number(process.env.TRIGGER_PERCENT ?? 1)

  if (Number.isFinite(threshold) && threshold >= triggerPercent) {
    return true
  }

  return Number.isFinite(costAmount) && Number.isFinite(budgetAmount) && budgetAmount > 0 && costAmount >= budgetAmount
}

exports.stopBilling = async (cloudEvent) => {
  const targetProjectId = process.env.TARGET_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT
  const simulationMode = process.env.SIMULATION_MODE === 'true'
  const payload = parseBudgetNotification(cloudEvent)

  if (!targetProjectId) {
    throw new Error('TARGET_PROJECT_ID or GOOGLE_CLOUD_PROJECT must be set.')
  }

  console.log(
    JSON.stringify({
      message: 'Received budget notification.',
      targetProjectId,
      simulationMode,
      payload,
    })
  )

  if (!shouldDisableBilling(payload)) {
    console.log('Notification did not meet the billing disable condition. No action taken.')
    return
  }

  const projectName = `projects/${targetProjectId}`
  const [billingInfo] = await billing.getProjectBillingInfo({ name: projectName })

  if (!billingInfo.billingAccountName) {
    console.log(`Billing is already disabled for ${projectName}.`)
    return
  }

  if (simulationMode) {
    console.log(`SIMULATION_MODE=true, would disable billing for ${projectName}.`)
    return
  }

  const [updatedBillingInfo] = await billing.updateProjectBillingInfo({
    name: projectName,
    projectBillingInfo: {
      name: projectName,
      billingAccountName: '',
    },
  })

  console.log(
    JSON.stringify({
      message: 'Billing disabled for project.',
      targetProjectId,
      updatedBillingInfo,
    })
  )
}

exports.stopBillingGen1 = async (pubSubEvent) => {
  const targetProjectId = process.env.TARGET_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
  const simulationMode = process.env.SIMULATION_MODE === 'true'
  const payload = parseLegacyPubSubNotification(pubSubEvent)

  if (!targetProjectId) {
    throw new Error('TARGET_PROJECT_ID, GCLOUD_PROJECT, or GOOGLE_CLOUD_PROJECT must be set.')
  }

  console.log(
    JSON.stringify({
      message: 'Received legacy Pub/Sub budget notification.',
      targetProjectId,
      simulationMode,
      payload,
    })
  )

  if (!shouldDisableBilling(payload)) {
    console.log('Notification did not meet the billing disable condition. No action taken.')
    return
  }

  const projectName = `projects/${targetProjectId}`
  const [billingInfo] = await billing.getProjectBillingInfo({ name: projectName })

  if (!billingInfo.billingAccountName) {
    console.log(`Billing is already disabled for ${projectName}.`)
    return
  }

  if (simulationMode) {
    console.log(`SIMULATION_MODE=true, would disable billing for ${projectName}.`)
    return
  }

  const [updatedBillingInfo] = await billing.updateProjectBillingInfo({
    name: projectName,
    projectBillingInfo: {
      name: projectName,
      billingAccountName: '',
    },
  })

  console.log(
    JSON.stringify({
      message: 'Billing disabled for project from legacy function.',
      targetProjectId,
      updatedBillingInfo,
    })
  )
}
