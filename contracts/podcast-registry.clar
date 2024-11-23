;; podcast-registry.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))

;; Define data variables
(define-data-var next-podcast-id uint u0)

;; Define podcast data structure
(define-map podcasts
  { podcast-id: uint }
  {
    owner: principal,
    name: (string-ascii 256),
    description: (string-utf8 1024),
    rss-feed: (string-ascii 256)
  }
)

;; Register a new podcast
(define-public (register-podcast (name (string-ascii 256)) (description (string-utf8 1024)) (rss-feed (string-ascii 256)))
  (let
    (
      (podcast-id (var-get next-podcast-id))
    )
    (map-set podcasts
      { podcast-id: podcast-id }
      {
        owner: tx-sender,
        name: name,
        description: description,
        rss-feed: rss-feed
      }
    )
    (var-set next-podcast-id (+ podcast-id u1))
    (ok podcast-id)
  )
)

;; Get podcast details
(define-read-only (get-podcast (podcast-id uint))
  (match (map-get? podcasts { podcast-id: podcast-id })
    podcast (ok podcast)
    (err err-not-found)
  )
)

;; Update podcast details
(define-public (update-podcast (podcast-id uint) (name (string-ascii 256)) (description (string-utf8 1024)) (rss-feed (string-ascii 256)))
  (match (map-get? podcasts { podcast-id: podcast-id })
    podcast
      (if (is-eq tx-sender (get owner podcast))
        (ok (map-set podcasts
          { podcast-id: podcast-id }
          {
            owner: (get owner podcast),
            name: name,
            description: description,
            rss-feed: rss-feed
          }
        ))
        err-owner-only
      )
    err-not-found
  )
)
