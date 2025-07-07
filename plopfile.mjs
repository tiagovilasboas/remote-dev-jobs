import { join } from 'node:path';

export default function (plop) {
  // helper paths
  const componentBasePath = 'src/components';
  const featureBasePath = 'src/features';

  // Component generator
  plop.setGenerator('component', {
    description: 'Create a React component folder (TSX + index + css)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g. Button):',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: `${componentBasePath}/{{pascalCase name}}`,
        base: '.plop-templates/component',
        templateFiles: '.plop-templates/component/*.hbs',
      },
    ],
  });

  // Feature generator
  plop.setGenerator('feature', {
    description: 'Create feature boilerplate (service, store, page)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (e.g. userProfile):',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: `${featureBasePath}/{{kebabCase name}}`,
        base: '.plop-templates/feature',
        templateFiles: '.plop-templates/feature/*.hbs',
      },
    ],
  });
} 