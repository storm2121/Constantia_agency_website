import PortfolioArchiveClient from '@/components/PortfolioArchiveClient'
import MobilePortfolio from '@/components/mobile/MobilePortfolio'
import DeviceGate from '@/components/DeviceGate'
import { getAllProjects } from '@/lib/content-repository'

export default async function PortfolioPage() {
  const projects = await getAllProjects()

  return (
    <DeviceGate
      desktop={<PortfolioArchiveClient projects={projects} />}
      mobile={<MobilePortfolio projects={projects} />}
    />
  )
}
