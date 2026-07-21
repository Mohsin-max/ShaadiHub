import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Button from './Button'

function OwnerActionCard({ venueId }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(75,44,94,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="storefront" className="text-antique-gold text-[20px]" />
        <h4 className="font-headline-sm text-[16px] text-primary">Manage This Listing</h4>
      </div>
      <p className="text-[12px] text-on-surface-variant mb-4 leading-relaxed">
        This is your own venue — booking actions are disabled here. Use the options below to manage it.
      </p>
      <div className="space-y-2">
        <Button variant="primary" onClick={() => navigate(`/provider/venues/${venueId}/edit`)}>
          <Icon name="edit" className="text-[16px]" />
          Edit Venue
        </Button>
        <Button variant="outline" onClick={() => navigate('/provider/dashboard')}>
          <Icon name="dashboard" className="text-[16px]" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default OwnerActionCard
