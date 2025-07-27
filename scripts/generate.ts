import { claude } from '@instantlyeasy/claude-code-sdk-ts';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get user request from command line or environment
const userRequest = process.env.USER_REQUEST || process.argv[2] || 'Please enter your request here.';

async function generateRequirements() {
  console.log('Generating requirements...');
  const template = readFileSync(join(__dirname, '../templates/requirements-template.md'), 'utf-8');
  
  const response = await claude()
    .withModel('sonnet')
    .allowTools('Read', 'Write')
    .query(`Based on the following user request: "${userRequest}", please fill out this requirements template:\n\n${template}`)
    .asText();
  
  writeFileSync('requirements.md', response);
  console.log('Requirements generated successfully!');
}

async function generateDesign() {
  console.log('Generating design document...');
  const template = readFileSync(join(__dirname, '../templates/design-template.md'), 'utf-8');
  const requirements = readFileSync('requirements.md', 'utf-8');
  
  const response = await claude()
    .withModel('sonnet')
    .allowTools('Read', 'Write')
    .query(`Based on the following requirements:\n\n${requirements}\n\nPlease fill out this design template:\n\n${template}`)
    .asText();
  
  writeFileSync('design.md', response);
  console.log('Design document generated successfully!');
}

async function generateTasks() {
  console.log('Generating task list...');
  const template = readFileSync(join(__dirname, '../templates/tasks-template.md'), 'utf-8');
  const design = readFileSync('design.md', 'utf-8');
  
  const response = await claude()
    .withModel('sonnet')
    .allowTools('Read', 'Write')
    .query(`Based on the following design document:\n\n${design}\n\nPlease fill out this task list template:\n\n${template}`)
    .asText();
  
  writeFileSync('tasks.md', response);
  console.log('Task list generated successfully!');
}

async function implementWithTDD() {
  console.log('Implementing with TDD...');
  const tasks = readFileSync('tasks.md', 'utf-8');
  
  await claude()
    .withModel('sonnet')
    .allowTools('Read', 'Write', 'Edit', 'Bash')
    .query(`Based on the following task list, implement the solution using TDD (Test-Driven Development) approach:\n\n${tasks}`)
    .asText();
  
  console.log('Implementation completed!');
}

async function main() {
  try {
    await generateRequirements();
    await generateDesign();
    await generateTasks();
    await implementWithTDD();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();