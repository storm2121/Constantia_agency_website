import Link from 'next/link'
import styles from '@/components/EditorialBackLink.module.css'

export default function PortfolioChildBackLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className={styles.control}
      aria-label={`Back to ${label}`}
    >
      <span aria-hidden="true" className={styles.line} />
      <span className={styles.label}>{`Back to ${label}`}</span>
    </Link>
  )
}
