import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';

export const getVehicleDetails = async (req, res) => {
    const { first, second } = req.query;

    try {
        const baseUrl = 'https://parivahan.gov.in/rcdlstatus/vahan/rcStatus.xhtml';
        
        // Define headers that mimic a real browser perfectly
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://parivahan.gov.in',
            'Referer': 'https://parivahan.gov.in/rcdlstatus/',
            'Connection': 'keep-alive'
        };

        // 1. SESSION INITIALIZATION
        // We must get the 'JSESSIONID' cookie first
        const init = await axios.get('https://parivahan.gov.in/rcdlstatus/', { headers });
        const cookies = init.headers['set-cookie'];
        const $1 = cheerio.load(init.data);
        const viewState = $1('input[name="javax.faces.ViewState"]').val();

        if (!viewState) {
            console.error("BLOCK DETECTED: Parivahan did not send a ViewState token.");
            return res.status(403).json({ error: "Access Denied by Government Portal. Try again in 5 minutes." });
        }

        // 2. DATA POSTING
        const payload = qs.stringify({
            'javax.faces.partial.ajax': 'true',
            'javax.faces.source': 'form_rcdl:j_idt32',
            'javax.faces.partial.execute': '@all',
            'javax.faces.partial.render': 'form_rcdl:pnl_show form_rcdl:pg_show form_rcdl:rcdl_pnl',
            'form_rcdl:j_idt32': 'form_rcdl:j_idt32',
            'form_rcdl': 'form_rcdl',
            'form_rcdl:tf_reg_no1': first,
            'form_rcdl:tf_reg_no2': second,
            'javax.faces.ViewState': viewState
        });

        const response = await axios.post('https://parivahan.gov.in/rcdlstatus/', payload, {
            headers: {
                ...headers,
                'Cookie': cookies ? cookies.join('; ') : '',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Faces-Request': 'partial/ajax',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // 3. DEEP PARSING
        const $ = cheerio.load(response.data);
        const resultData = {};

        // Parivahan results are usually inside 'ui-panel-content'
        $('tr').each((i, row) => {
            const cols = $(row).find('td');
            if (cols.length >= 2) {
                const key = $(cols[0]).text().replace(':', '').trim();
                const value = $(cols[1]).text().trim();
                if (key && value && key !== value) {
                    resultData[key] = value;
                }
            }
        });

        if (Object.keys(resultData).length === 0) {
            // Check if the site returned a 'No Records Found' message
            const msg = $('.ui-messages-error-detail').text() || "Scraper could not find data tables.";
            return res.status(404).json({ error: msg });
        }

        res.json(resultData);

    } catch (error) {
        console.error("SERVER CRASH LOG:", error.message);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

export const getSafetyGuide = (req, res) => {
    res.json({ message: "Welcome to John's Safety Guide" });
};