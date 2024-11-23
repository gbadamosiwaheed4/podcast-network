;; content-curation.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-voted (err u102))
(define-constant err-invalid-rating (err u103))

;; Define data variables
(define-map podcast-ratings
  { podcast-id: uint }
  { total-rating: uint, num-ratings: uint }
)

(define-map user-ratings
  { user: principal, podcast-id: uint }
  { rating: uint }
)

;; Rate a podcast
(define-public (rate-podcast (podcast-id uint) (rating uint))
  (let
    (
      (user tx-sender)
    )
    (asserts! (and (>= rating u1) (<= rating u5)) err-invalid-rating)
    (match (map-get? user-ratings { user: user, podcast-id: podcast-id })
      previous-rating err-already-voted
      (begin
        (match (map-get? podcast-ratings { podcast-id: podcast-id })
          current-ratings (map-set podcast-ratings
            { podcast-id: podcast-id }
            {
              total-rating: (+ (get total-rating current-ratings) rating),
              num-ratings: (+ (get num-ratings current-ratings) u1)
            }
          )
          (map-set podcast-ratings
            { podcast-id: podcast-id }
            { total-rating: rating, num-ratings: u1 }
          )
        )
        (map-set user-ratings
          { user: user, podcast-id: podcast-id }
          { rating: rating }
        )
        (ok true)
      )
    )
  )
)

;; Get podcast rating
(define-read-only (get-podcast-rating (podcast-id uint))
  (match (map-get? podcast-ratings { podcast-id: podcast-id })
    ratings (let
      (
        (total-rating (get total-rating ratings))
        (num-ratings (get num-ratings ratings))
      )
      (ok {
        average-rating: (/ (* total-rating u100) num-ratings),
        num-ratings: num-ratings
      })
    )
    (err err-not-found)
  )
)

;; Get user's rating for a podcast
(define-read-only (get-user-rating (user principal) (podcast-id uint))
  (match (map-get? user-ratings { user: user, podcast-id: podcast-id })
    rating (ok (get rating rating))
    (err err-not-found)
  )
)

