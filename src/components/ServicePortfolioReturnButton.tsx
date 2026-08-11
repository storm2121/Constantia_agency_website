'use client'

import { useRouter } from 'next/navigation'
import styles from '@/components/EditorialBackLink.module.css'
import {
  getReturnToServicesHref,
  readServiceReturnState,
  type ServicePortfolioConfig,
  type ServiceReturnState,
  writeServiceReturnState,
} from '@/lib/service-portfolios'

export default function ServicePortfolioReturnButton({
  service,
}: {
  service: ServicePortfolioConfig
}) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const existing = readServiceReturnState()
      const nextState: ServiceReturnState = existing ?? {
        service: service.slug,
        sliderIndex: service.sliderIndex,
        savedAt: Date.now(),
      }

      writeServiceReturnState({
        ...nextState,
        service: service.slug,
        sliderIndex: service.sliderIndex,
        savedAt: Date.now(),
      })
    }

    router.push(getReturnToServicesHref(service.slug), { scroll: false })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.control}
      aria-label="Back to Services"
    >
      <span aria-hidden="true" className={styles.line} />
      <span className={styles.label}>Back to Services</span>
    </button>
  )
}
