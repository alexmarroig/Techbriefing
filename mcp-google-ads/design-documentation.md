# Google Ads API Tool Design Documentation

## 1. Project Overview
We are developing a private, in-house internal automation script ("Nexora Ads Manager") written in Node.js. The tool is designed exclusively for internal employees to monitor the performance of our owned campaigns and automate basic daily budget adjustments based on conversion ROI.

## 2. Intended Audience
*   **User Type:** Internal users only (employees and developers of Nexora Systems).
*   **Accessibility:** Private command-line interface and internal dashboard. No public or third-party access is allowed.

## 3. Google Ads API Services & Methods Used
The tool utilizes the Google Ads API REST interface to interact with the following resources:

### A. Reporting & Search (Read-only)
*   **Endpoint:** `https://googleads.googleapis.com/v20/customers/{customerId}/googleAds:search`
*   **GAQL Query Example:**
    ```sql
    SELECT 
      campaign.id, 
      campaign.name, 
      campaign.status, 
      metrics.cost_micros, 
      metrics.clicks, 
      metrics.impressions, 
      metrics.ctr, 
      metrics.conversions, 
      metrics.cost_per_conversion 
    FROM campaign 
    WHERE segments.date BETWEEN '{startDate}' AND '{endDate}'
    ```
*   **Use Case:** Retrieve live performance metrics (Cost, Clicks, Impressions, CTR, and Conversions) to evaluate campaign performance.

### B. Campaign Management (Mutate/Write)
*   **Endpoints:** 
    *   `https://googleads.googleapis.com/v20/customers/{customerId}/campaigns:mutate`
    *   `https://googleads.googleapis.com/v20/customers/{customerId}/campaignBudgets:mutate`
*   **Use Cases:**
    *   **ads_toggle_campaign:** Programmatically pause underperforming campaigns that exceed our Target CPA or enable high-performing campaigns.
    *   **ads_update_budget:** Adjust daily campaign budgets (micros) based on real-time ROI calculations to maximize sales efficiency.

## 4. System Architecture
```
+-------------------------------------------------------+
|                 Nexora Internal CLI                   |
+---------------------------+---------------------------+
                            | (Command Executed)
                            v
+-------------------------------------------------------+
|               Internal Node.js Script                 |
+---------------------------+---------------------------+
                            | (Reads credentials.json)
                            v
+-------------------------------------------------------+
|            OAuth2 Token Refresh Mechanism             |
+---------------------------+---------------------------+
                            | (Secured HTTPS POST)
                            v
+-------------------------------------------------------+
|             Google Ads REST API (v20)                 |
+-------------------------------------------------------+
```

## 5. Security & Data Protection
*   **Credential Security:** All API keys, Client IDs, Client Secrets, and OAuth2 Refresh Tokens are stored locally on secured development environments inside a git-ignored `credentials.json` file.
*   **Authentication:** Access token refresh requests are performed over secure HTTPS channels directly to Google OAuth2 endpoints.
*   **Data Handling:** No third-party data is processed. All queried metrics are strictly internal to Nexora Systems' Google Ads account.
