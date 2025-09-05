import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = {
  title: 'NestJS Template API',
  description:
    'A comprehensive NestJS template with Clean Architecture, DDD patterns, and enterprise-ready features',
  version: '1.0.0',
  tag: 'api',
  path: 'api/docs',
  contact: {
    name: 'API Support',
    email: 'support@example.com',
    url: 'https://example.com',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
};

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .setContact(
      swaggerConfig.contact.name,
      swaggerConfig.contact.email,
      swaggerConfig.contact.url,
    )
    .setLicense(swaggerConfig.license.name, swaggerConfig.license.url)
    .addServer(
      swaggerConfig.servers[0].url,
      swaggerConfig.servers[0].description,
    )
    // .addServer(
    //   swaggerConfig.servers[1].url,
    //   swaggerConfig.servers[1].description,
    // )
    .addTag('Health', 'Health check endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for external services',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup(swaggerConfig.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list', // Changed from 'none' to 'list' for better UX
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
      layout: 'StandaloneLayout',
      deepLinking: true,
      showMutatedRequest: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      validatorUrl: null, // Disable online validator
    },
    customSiteTitle: `${swaggerConfig.title} Documentation`,
    customfavIcon: '/favicon.ico',
    customCss: `
      /* Modern Swagger UI Styling */
      .swagger-ui .topbar { 
        background: linear-gradient(135deg,rgb(231, 154, 98) 0%,rgb(239, 109, 28) 100%);
        border-bottom: 3px solidrgb(0, 0, 0);
      }
      
      .swagger-ui .topbar .download-url-wrapper { 
        display: none; 
      }
      
      .swagger-ui .info .title { 
        color: #2d3748; 
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .swagger-ui .info .description { 
        color: #4a5568; 
        font-size: 1.1rem;
        line-height: 1.6;
      }
      
      .swagger-ui .info .base-url { 
        font-weight: 600; 
        color: #2d3748;
      }
      
      .swagger-ui .scheme-container { 
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
        padding: 1rem; 
        border-radius: 8px; 
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .swagger-ui .opblock.opblock-post { 
        border-color: #48bb78; 
        background: rgba(72, 187, 120, 0.1);
      }
      
      .swagger-ui .opblock.opblock-get { 
        border-color: #4299e1; 
        background: rgba(66, 153, 225, 0.1);
      }
      
      .swagger-ui .opblock.opblock-put { 
        border-color: #ed8936; 
        background: rgba(237, 137, 54, 0.1);
      }
      
      .swagger-ui .opblock.opblock-delete { 
        border-color: #f56565; 
        background: rgba(245, 101, 101, 0.1);
      }
      
      .swagger-ui .opblock .opblock-summary { 
        border-radius: 6px; 
      }
      
      .swagger-ui .btn.authorize { 
        color: white;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        padding: 8px 16px;
        transition: all 0.2s ease;
      }
      
      .swagger-ui .btn.authorize:hover { 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      
      .swagger-ui .btn.execute { 
        color: white;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        padding: 8px 16px;
        transition: all 0.2s ease;
      }
      
      .swagger-ui .btn.execute:hover { 
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
      }
      
      .swagger-ui .response-col_status { 
        font-weight: 600; 
      }
      
      .swagger-ui .model-title { 
        color: #2d3748; 
        font-weight: 600;
      }
      
      .swagger-ui .parameter__name { 
        color: #4a5568; 
        font-weight: 600;
      }
      
      .swagger-ui .parameter__type { 
        color: #718096; 
        font-size: 0.9rem;
      }
      
      .swagger-ui .response-col_description__inner p { 
        color: #4a5568; 
        line-height: 1.5;
      }
      
      .swagger-ui .highlight-code { 
        background: #f7fafc; 
        border-radius: 4px; 
        padding: 1rem;
      }
      
      .swagger-ui .info .base-url { 
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
        background: #f7fafc; 
        padding: 0.5rem; 
        border-radius: 4px; 
        border: 1px solid #e2e8f0;
      }
      
      /* Code block styling - make text black */
      .swagger-ui .opblock-description-wrapper pre,
      .swagger-ui .opblock-description-wrapper code,
      .swagger-ui .opblock-description-wrapper pre code,
      .swagger-ui .opblock-description-wrapper .highlight-code,
      .swagger-ui .opblock-description-wrapper .highlight-code code,
      .swagger-ui .opblock-description-wrapper .highlight-code pre,
      .swagger-ui .opblock-description-wrapper .highlight-code pre code,
      .swagger-ui .opblock-description-wrapper .microlight,
      .swagger-ui .opblock-description-wrapper .microlight code,
      .swagger-ui .opblock-description-wrapper .microlight pre,
      .swagger-ui .opblock-description-wrapper .microlight pre code,
      .swagger-ui .opblock-description-wrapper .hljs,
      .swagger-ui .opblock-description-wrapper .hljs code,
      .swagger-ui .opblock-description-wrapper .hljs pre,
      .swagger-ui .opblock-description-wrapper .hljs pre code {
        color: #000000 !important;
        background-color: #f8f9fa !important;
        border: 1px solid #e9ecef !important;
        border-radius: 4px !important;
        padding: 12px !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        overflow-x: auto !important;
      }
      
      /* Ensure code blocks in descriptions have black text */
      .swagger-ui .opblock-description-wrapper p code,
      .swagger-ui .opblock-description-wrapper li code,
      .swagger-ui .opblock-description-wrapper td code,
      .swagger-ui .opblock-description-wrapper th code {
        color: #000000 !important;
        background-color: #f8f9fa !important;
        padding: 2px 6px !important;
        border-radius: 3px !important;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace !important;
        font-size: 12px !important;
      }
      
      /* Markdown code block styling */
      .swagger-ui .opblock-description-wrapper pre[class*="language-"],
      .swagger-ui .opblock-description-wrapper code[class*="language-"],
      .swagger-ui .opblock-description-wrapper pre[class*="lang-"],
      .swagger-ui .opblock-description-wrapper code[class*="lang-"] {
        color: #000000 !important;
        background-color: #f8f9fa !important;
      }
    `,
  });
}
