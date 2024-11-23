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

