# Roadmap / Bonus Features

The mandatory deliverables are fully implemented. These bonus items from the
brief are natural extensions of the existing architecture:

- **PDF export** — reuse `reportController.exportAnalyticsCsv` as a template;
  swap `toCsv` for a PDF generator (e.g. `pdfkit`) over the same
  `buildVehicleAnalytics()` data.
- **Email reminders for license expiry** — a scheduled job (e.g.
  `node-cron`) calling the existing `GET /drivers/expiring/list` logic and
  emailing via `nodemailer`.
- **QR codes for vehicles** — generate with the `qrcode` npm package from each
  vehicle's `registrationNumber`, store the data URL on the `Vehicle.imageUrl`
  field or a new `qrCodeUrl` field.
- **Vehicle document upload** — `Vehicle.documents[]` already exists in the
  schema; wire up `multer` (already a dependency) + an upload route, or
  Cloudinary for persistent storage.
- **Activity logs** — a lightweight `AuditLog` model + middleware that records
  `req.user`, method, route and timestamp on mutating requests.
