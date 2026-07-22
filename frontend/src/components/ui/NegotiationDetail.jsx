import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import Button from './Button'
import StatusBadge from './StatusBadge'
import ErrorBanner from './ErrorBanner'
import ConfirmModal from './ConfirmModal'

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString('en-PK')}`
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function offerLabel(offer, request) {
  const isViewer = offer.offeredBy === request.viewerRole
  if (isViewer) return 'You'
  return offer.offeredBy === 'Client' ? request.clientName : 'Venue Owner'
}

function NegotiationDetail({
  request,
  venueHref,
  onRespond,
  responding,
  respondError,
  onCancel,
  onRequestDateChange,
  onRespondDateChange,
}) {
  const [actionMode, setActionMode] = useState(null)
  const [counterPrice, setCounterPrice] = useState('')
  const [counterNote, setCounterNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [newDate, setNewDate] = useState('')
  const [dateChangeNote, setDateChangeNote] = useState('')
  const [confirmMode, setConfirmMode] = useState(null)

  const cancelAction = () => setActionMode(null)

  const submitCounter = () => {
    if (!counterPrice) return
    onRespond('Counter', { price: Number(counterPrice), note: counterNote.trim() || null })
  }

  const counterpartLabel = request.viewerRole === 'Client' ? request.ownerName : request.clientName
  const counterpartRoleLabel = request.viewerRole === 'Client' ? 'Venue Owner' : 'Client'

  const confirmCopy = {
    accept: {
      title: 'Confirm This Booking',
      details: [
        { label: 'Venue', value: request.venueName, wide: true },
        { label: counterpartRoleLabel, value: counterpartLabel },
        { label: 'Event Date', value: formatDate(request.eventDate) },
        { label: 'Amount', value: formatPrice(request.currentPrice) },
      ],
      message: 'Do you want to accept and confirm this booking? This will lock in the date.',
      confirmLabel: 'Yes, Confirm Booking',
      variant: 'primary',
    },
    reject: {
      title: 'Confirm Rejection',
      details: [
        { label: 'Venue', value: request.venueName, wide: true },
        { label: counterpartRoleLabel, value: counterpartLabel },
        { label: 'Event Date', value: formatDate(request.eventDate) },
      ],
      message: 'Do you want to reject this request? They will see your reason and this negotiation will end.',
      confirmLabel: 'Yes, Reject It',
      variant: 'danger',
    },
    cancel: {
      title: 'Confirm Cancellation',
      details: [
        { label: 'Venue', value: request.venueName, wide: true },
        { label: counterpartRoleLabel, value: counterpartLabel },
        { label: 'Event Date', value: formatDate(request.eventDate) },
      ],
      message: `Are you sure you want to cancel this booking? ${counterpartLabel} will see your reason. This can't be undone.`,
      confirmLabel: 'Yes, Cancel Booking',
      variant: 'danger',
    },
    acceptDateChange: {
      title: 'Confirm New Date',
      details: [
        { label: 'Venue', value: request.venueName, wide: true },
        { label: 'Current Date', value: formatDate(request.eventDate) },
        { label: 'New Date', value: request.pendingNewDate ? formatDate(request.pendingNewDate) : '' },
      ],
      message: 'Do you want to move this booking to the new date requested?',
      confirmLabel: 'Yes, Update Date',
      variant: 'primary',
    },
  }[confirmMode] || {}

  const handleConfirm = () => {
    if (confirmMode === 'accept') {
      onRespond('Accept', {})
    } else if (confirmMode === 'reject') {
      onRespond('Reject', { note: rejectReason.trim() })
    } else if (confirmMode === 'cancel') {
      onCancel(cancelReason.trim())
      setActionMode(null)
    } else if (confirmMode === 'acceptDateChange') {
      onRespondDateChange('Accept')
    }
    setConfirmMode(null)
  }

  const submitDateChangeRequest = () => {
    if (!newDate) return
    onRequestDateChange(newDate, dateChangeNote.trim() || null)
    setActionMode(null)
    setNewDate('')
    setDateChangeNote('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {request.venueImage && (
              <img
                src={request.venueImage}
                alt=""
                className="w-14 h-14 rounded-lg object-cover border border-outline-variant shrink-0"
              />
            )}
            <div className="min-w-0">
              <Link
                to={venueHref}
                className="font-headline-sm text-[17px] text-primary hover:text-secondary transition-colors truncate block"
              >
                {request.venueName}
              </Link>
              <p className="text-[12px] text-on-surface-variant truncate">
                {request.venueAreaName}, {request.venueCity}
              </p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-outline-variant">
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Event Date
            </p>
            <p className="text-[13px] font-bold text-on-surface">{formatDate(request.eventDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Listed Price
            </p>
            <p className="text-[13px] font-bold text-on-surface">{formatPrice(request.listedPriceSnapshot)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Current Offer
            </p>
            <p className="text-[13px] font-bold text-antique-gold">{formatPrice(request.currentPrice)}</p>
          </div>
        </div>
      </div>

      {/* Negotiation trail */}
      <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
        <h4 className="font-headline-sm text-[15px] text-primary mb-4 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-antique-gold inline-block" />
          Negotiation History
        </h4>
        <div className="space-y-3">
          {request.offers.map((offer, i) => (
            <div key={offer.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </div>
                {i < request.offers.length - 1 && <div className="w-px flex-1 bg-outline-variant mt-1" />}
              </div>
              <div className="pb-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-bold text-primary">{offerLabel(offer, request)}</span>
                  <span className="text-[13px] font-bold text-on-surface">{formatPrice(offer.price)}</span>
                  <span className="text-[11px] text-on-surface-variant">{formatTimestamp(offer.createdAt)}</span>
                </div>
                {offer.note && <p className="text-[12px] text-on-surface-variant mt-1">{offer.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status-specific panels */}
      {request.status === 'Rejected' && request.rejectReason && (
        <div className="bg-error-container/40 border border-error-container rounded-xl p-4">
          <p className="text-[12px] font-bold text-on-error-container mb-1">Reason for rejection</p>
          <p className="text-[13px] text-on-error-container">{request.rejectReason}</p>
        </div>
      )}

      {request.status === 'Cancelled' && (
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-4">
          <p className="text-[12px] font-bold text-on-surface-variant mb-1">
            Cancelled by {request.cancelledBy === request.viewerRole ? 'you' : counterpartLabel}
          </p>
          {request.cancelReason && <p className="text-[13px] text-on-surface">{request.cancelReason}</p>}
        </div>
      )}

      {(request.status === 'Booked' || request.status === 'Cancelled') && request.contactInfo && (
        <div className="bg-primary/[0.04] border border-antique-gold/30 rounded-xl p-5">
          <h4 className="font-headline-sm text-[15px] text-primary mb-3 flex items-center gap-2">
            <Icon name="verified" className="text-antique-gold text-[18px]" />
            {request.status === 'Booked' ? 'Booking Confirmed — Contact Details' : 'Contact Details'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg border border-outline-variant p-3">
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Client</p>
              <p className="text-[13px] font-bold text-on-surface">{request.contactInfo.clientName}</p>
              <p className="text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                <Icon name="call" className="text-[14px]" /> {request.contactInfo.clientPhone}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-outline-variant p-3">
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Venue Owner
              </p>
              <p className="text-[13px] font-bold text-on-surface">{request.contactInfo.ownerName}</p>
              <p className="text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                <Icon name="call" className="text-[14px]" /> {request.contactInfo.ownerPhone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booked-state actions: date change + cancel */}
      {request.status === 'Booked' && (
        <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
          <ErrorBanner message={respondError} />

          {request.pendingNewDate && (
            <div className="bg-antique-gold/10 border border-antique-gold/30 rounded-lg p-4">
              <p className="text-[12px] font-bold text-primary mb-1 flex items-center gap-1.5">
                <Icon name="event_repeat" className="text-[16px]" />
                Date Change Requested
              </p>
              <p className="text-[13px] text-on-surface">
                New date: <span className="font-bold">{formatDate(request.pendingNewDate)}</span>
              </p>
              {request.dateChangeNote && (
                <p className="text-[12px] text-on-surface-variant mt-1">{request.dateChangeNote}</p>
              )}

              {request.canRespondToDateChange ? (
                <div className="flex gap-2.5 mt-3">
                  <Button
                    variant="primary"
                    fullWidth={false}
                    className="px-4"
                    disabled={responding}
                    onClick={() => setConfirmMode('acceptDateChange')}
                  >
                    Accept New Date
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth={false}
                    className="px-4"
                    disabled={responding}
                    onClick={() => onRespondDateChange('Reject')}
                  >
                    Keep Original Date
                  </Button>
                </div>
              ) : (
                <p className="text-[12px] text-on-surface-variant mt-2 flex items-center gap-1.5">
                  <Icon name="hourglass_top" className="text-[14px]" />
                  Waiting for the venue owner to respond.
                </p>
              )}
            </div>
          )}

          {actionMode === null && (
            <div className="flex flex-wrap gap-2.5">
              {request.canRequestDateChange && (
                <Button
                  variant="gold"
                  fullWidth={false}
                  className="px-5"
                  onClick={() => setActionMode('dateChange')}
                >
                  <Icon name="event_repeat" className="text-[16px]" /> Request Date Change
                </Button>
              )}
              {request.canCancel && (
                <Button
                  variant="outline"
                  fullWidth={false}
                  className="px-5 border-error text-error hover:bg-error-container/30"
                  onClick={() => setActionMode('cancel')}
                >
                  <Icon name="cancel" className="text-[16px]" /> Cancel Booking
                </Button>
              )}
            </div>
          )}

          {actionMode === 'dateChange' && (
            <div className="space-y-3 pt-3 border-t border-outline-variant">
              <div className="space-y-1">
                <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
                  New Date
                </label>
                <input
                  type="date"
                  min={todayISO()}
                  autoFocus
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>
              <textarea
                rows={2}
                value={dateChangeNote}
                onChange={(e) => setDateChangeNote(e.target.value)}
                placeholder="Optional note for the venue owner…"
                className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
              <div className="flex gap-2.5">
                <Button variant="outline" fullWidth={false} className="px-5" onClick={cancelAction}>
                  Never Mind
                </Button>
                <Button
                  variant="primary"
                  fullWidth={false}
                  className="px-5"
                  disabled={responding || !newDate}
                  onClick={submitDateChangeRequest}
                >
                  {responding ? 'Sending…' : 'Send Date Change Request'}
                </Button>
              </div>
            </div>
          )}

          {actionMode === 'cancel' && (
            <div className="space-y-3 pt-3 border-t border-outline-variant">
              <textarea
                rows={2}
                autoFocus
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancelling (required)…"
                className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
              <div className="flex gap-2.5">
                <Button variant="outline" fullWidth={false} className="px-5" onClick={cancelAction}>
                  Never Mind
                </Button>
                <Button
                  variant="danger"
                  fullWidth={false}
                  className="px-5"
                  disabled={responding || !cancelReason.trim()}
                  onClick={() => setConfirmMode('cancel')}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {(request.status === 'Pending' || request.status === 'Countered') && (
        <div className="bg-white rounded-xl border border-outline-variant p-5 shadow-sm">
          <ErrorBanner message={respondError} />
          {!request.isMyTurn ? (
            <p className="text-[13px] text-on-surface-variant flex items-center gap-2">
              <Icon name="hourglass_top" className="text-[16px]" />
              Waiting for {request.viewerRole === 'Client' ? 'the venue owner' : 'the client'} to respond.
            </p>
          ) : actionMode === null ? (
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                fullWidth={false}
                className="px-5"
                disabled={responding}
                onClick={() => setConfirmMode('accept')}
              >
                <Icon name="check_circle" className="text-[16px]" /> Accept
              </Button>
              <Button
                variant="gold"
                fullWidth={false}
                className="px-5"
                disabled={responding}
                onClick={() => setActionMode('counter')}
              >
                <Icon name="sync_alt" className="text-[16px]" /> Counter-Offer
              </Button>
              <Button
                variant="outline"
                fullWidth={false}
                className="px-5"
                disabled={responding}
                onClick={() => setActionMode('reject')}
              >
                <Icon name="close" className="text-[16px]" /> Reject
              </Button>
            </div>
          ) : actionMode === 'counter' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1 space-y-1">
                  <label className="block font-bold text-[11px] text-primary uppercase tracking-wider">
                    Your Counter Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    autoFocus
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder="e.g. 300,000"
                    className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Optional note…"
                className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
              <div className="flex gap-2.5">
                <Button variant="outline" fullWidth={false} className="px-5" onClick={cancelAction}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth={false}
                  className="px-5"
                  disabled={responding || !counterPrice}
                  onClick={submitCounter}
                >
                  {responding ? 'Sending…' : 'Send Counter-Offer'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={2}
                autoFocus
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Short reason for rejecting (required)…"
                className="w-full px-3.5 py-2.5 text-[14px] bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
              />
              <div className="flex gap-2.5">
                <Button variant="outline" fullWidth={false} className="px-5" onClick={cancelAction}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth={false}
                  className="px-5"
                  disabled={responding || !rejectReason.trim()}
                  onClick={() => setConfirmMode('reject')}
                >
                  Reject Request
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmMode !== null}
        title={confirmCopy.title}
        details={confirmCopy.details}
        message={confirmCopy.message}
        confirmLabel={confirmCopy.confirmLabel}
        variant={confirmCopy.variant}
        loading={responding}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmMode(null)}
      />
    </div>
  )
}

export default NegotiationDetail
