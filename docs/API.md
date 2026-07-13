# API Reference

Base URL: `http://localhost:5000/api`

All protected routes require `Authorization: Bearer <token>` header.
List endpoints support `?search=&page=&limit=&sort=&status=&type=` query params.

## Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/logout` | Private | Logout |
| GET | `/auth/me` | Private | Current user |
| PUT | `/auth/profile` | Private | Update own profile |

## Vehicles
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/vehicles` | Private | List (search/filter/sort/paginate) |
| GET | `/vehicles/available/list` | Private | Available vehicles only |
| GET | `/vehicles/:id` | Private | Details + timeline |
| POST | `/vehicles` | Admin, Fleet Manager | Register vehicle |
| PUT | `/vehicles/:id` | Admin, Fleet Manager | Update vehicle |
| DELETE | `/vehicles/:id` | Admin | Soft-delete vehicle |

## Drivers
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/drivers` | Private | List |
| GET | `/drivers/available/list` | Private | Available, non-expired drivers |
| GET | `/drivers/expiring/list` | Private | Licenses expiring ≤30 days or expired |
| GET | `/drivers/:id` | Private | Details |
| POST | `/drivers` | Admin, Fleet Manager, Safety Officer | Add driver |
| PUT | `/drivers/:id` | Admin, Fleet Manager, Safety Officer | Update driver |
| DELETE | `/drivers/:id` | Admin | Soft-delete driver |

## Trips
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/trips` | Private | List |
| GET | `/trips/:id` | Private | Details |
| POST | `/trips` | Private | Create trip (Draft) |
| PUT | `/trips/:id` | Private | Edit a Draft trip |
| PATCH | `/trips/:id/dispatch` | Admin, Fleet Manager, Driver | Validate rules & dispatch |
| PATCH | `/trips/:id/complete` | Admin, Fleet Manager, Driver | Complete a dispatched trip |
| PATCH | `/trips/:id/cancel` | Admin, Fleet Manager | Cancel Draft/Dispatched trip |
| DELETE | `/trips/:id` | Admin, Fleet Manager | Delete a Draft trip |

## Maintenance
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/maintenance` | Private | List |
| GET | `/maintenance/:id` | Private | Details |
| POST | `/maintenance` | Admin, Fleet Manager | Create (vehicle → In Shop) |
| PUT | `/maintenance/:id` | Admin, Fleet Manager | Update (Completed → vehicle Available) |
| DELETE | `/maintenance/:id` | Admin | Delete |

## Fuel
| Method | Route | Access |
|---|---|---|
| GET/POST | `/fuel` | Private |
| PUT/DELETE | `/fuel/:id` | Private / Admin, Fleet Manager |

## Expenses
| Method | Route | Access |
|---|---|---|
| GET/POST | `/expenses` | Private |
| PUT/DELETE | `/expenses/:id` | Private / Admin, Financial Analyst |

## Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/dashboard/kpis` | Active/available/maintenance vehicles, drivers on duty, active/pending trips, fleet utilization |
| GET | `/dashboard/charts` | Vehicle status, monthly trips, monthly expenses, monthly fuel |
| GET | `/dashboard/recent-trips` | Last 8 trips |

## Reports
| Method | Route | Description |
|---|---|---|
| GET | `/reports/analytics` | Fleet utilization, per-vehicle ROI/efficiency, trips & maintenance summary |
| GET | `/reports/export/csv` | Downloads per-vehicle analytics as CSV |

## Users (Admin only)
| Method | Route | Description |
|---|---|---|
| GET | `/users` | List users |
| PUT | `/users/:id` | Update role/active status |
| DELETE | `/users/:id` | Delete user |

## Response shape

```json
{ "success": true, "data": ..., "message": "..." }
```

List endpoints add `count`, `total`, `page`, `pages`. Errors:

```json
{ "success": false, "message": "..." }
```
