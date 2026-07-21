import Icon from './Icon'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function PriceSummaryCard({ venue, specialEntrySelected, onToggleSpecialEntry }) {
  const total = venue.price + (specialEntrySelected ? Number(venue.specialEntryPrice || 0) : 0)

  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(75,44,94,0.08)]">
      <h4 className="font-headline-sm text-[16px] text-primary mb-4 flex items-center gap-2">
        <Icon name="receipt_long" className="text-antique-gold text-[18px]" />
        Price Summary
      </h4>

      <div className="flex items-center justify-between text-[13px] mb-1">
        <span className="text-on-surface-variant">Base Price</span>
        <span className="font-semibold text-on-surface">{formatPrice(venue.price)}</span>
      </div>
      {venue.weekendPrice && (
        <div className="flex items-center justify-between text-[12px] text-on-surface-variant mb-1">
          <span>Weekend Price</span>
          <span>{formatPrice(venue.weekendPrice)}</span>
        </div>
      )}

      {venue.specialEntryEnabled && (
        <label className="flex items-start gap-2.5 cursor-pointer bg-surface-container-lowest hover:bg-secondary-container/20 border border-outline-variant rounded-lg p-3 mt-3 transition-colors">
          <input
            type="checkbox"
            checked={specialEntrySelected}
            onChange={(e) => onToggleSpecialEntry(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-primary">Special Entry</span>
              <span className="text-[12px] font-bold text-antique-gold shrink-0">
                +{formatPrice(venue.specialEntryPrice)}
              </span>
            </div>
            {venue.specialEntryDescription && (
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                {venue.specialEntryDescription}
              </p>
            )}
          </div>
        </label>
      )}

      <div className="flex items-center justify-between border-t border-outline-variant pt-3 mt-3">
        <span className="text-[13px] font-bold text-primary">Total</span>
        <span className="text-[19px] font-bold text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  )
}

export default PriceSummaryCard
