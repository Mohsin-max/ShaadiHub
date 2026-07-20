import ProviderSidebar from '../components/layout/ProviderSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import StatCard from '../components/ui/StatCard'
import EmptyStateCard from '../components/ui/EmptyStateCard'
import Icon from '../components/ui/Icon'

function ProviderDashboardPage() {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      <ProviderSidebar />

      <main className="flex-1 md:ml-52 min-h-screen overflow-y-auto pb-16 md:pb-0">
        <DashboardHeader />

        <div className="p-5 md:p-6 max-w-[1280px] mx-auto space-y-6">
          {/* Quick Stats */}
          <section>
            <h2 className="font-title-lg text-[15px] text-primary mb-3 flex items-center gap-1.5">
              <Icon name="analytics" className="text-secondary text-[18px]" />
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <StatCard
                icon="event_seat"
                iconClassName="bg-secondary-container/30 text-on-secondary-container"
                value="0"
                label="Total Bookings"
              />
              <StatCard
                icon="chat_bubble"
                iconClassName="bg-primary-container/10 text-primary"
                value="0"
                label="Pending Inquiries"
                badge="Last 30 Days"
                badgeClassName="text-on-surface-variant bg-surface-container"
              />
            </div>
          </section>

          {/* Empty State */}
          <section>
            <EmptyStateCard
              icon="add_business"
              title="Add Your First Venue"
              description="Start reaching thousands of couples planning their perfect wedding. List your halls, marquees, or outdoor spaces and manage inquiries effortlessly."
              actionLabel="Get Started Now"
              actionIcon="rocket_launch"
            />
          </section>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default ProviderDashboardPage
