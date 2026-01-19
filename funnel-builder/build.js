import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register Handlebars helpers
Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

async function buildFunnel(configName) {
    try {
        console.log(`\n🚀 Building funnel: ${configName}\n`);

        // Read config
        const configPath = path.join(__dirname, 'configs', `${configName}.json`);
        const configContent = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configContent);

        console.log(`✓ Loaded config for: ${config.meta.title}`);

        // Read template
        const templatePath = path.join(__dirname, 'templates', 'index.hbs');
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const template = Handlebars.compile(templateContent);

        console.log(`✓ Loaded template: index.hbs`);

        // Generate HTML
        const html = template(config);

        // Create output directory
        const outputDir = path.join(__dirname, 'output', config.id);
        await fs.mkdir(outputDir, { recursive: true });

        // Write HTML file
        const outputPath = path.join(outputDir, 'index.html');
        await fs.writeFile(outputPath, html, 'utf-8');

        console.log(`✓ Generated: ${outputPath}`);
        console.log(`\n✅ Funnel built successfully!\n`);
        console.log(`📁 Output location: funnel-builder/output/${config.id}/`);
        console.log(`🌐 Open: funnel-builder/output/${config.id}/index.html\n`);

    } catch (error) {
        console.error(`\n❌ Build failed:`, error.message);
        process.exit(1);
    }
}

// Get config name from command line args
const configName = process.argv[2] || 'test-funnel';
buildFunnel(configName);
