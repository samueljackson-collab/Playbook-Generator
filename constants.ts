
import type { Selections } from './types';

export const QUICK_START_TEMPLATES: { name: string; description: string; selections: Partial<Selections> }[] = [
    {
        name: 'Secure Media Server',
        description: 'A complete setup for Plex/Jellyfin with secure remote access and automated SSL.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- A registered domain name for valid SSL certificates.\n- Firewall ports 80 and 443 open to the host running the reverse proxy.\n- Host with hardware transcoding support (e.g., Intel Quick Sync) is recommended for best performance.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
                'Certificate management (Let\'s Encrypt)': true,
            },
            servicePlaybooks: {
                'Docker installation and configuration': true,
            },
            appDeployments: {
                'Media server (Plex/Jellyfin)': true,
            },
            documentation: {
                'Playbook reference (README)': true,
            }
        }
    },
    {
        name: 'Comprehensive Monitoring Stack',
        description: 'Deploys Prometheus, Grafana, Alertmanager, and Node Exporter for robust system and application monitoring.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- Host with a minimum of 8GB RAM and 4 vCPUs.\n- Network access for monitoring agents.\n- A registered domain name if exposing Grafana securely via the reverse proxy.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            servicePlaybooks: {
                'Docker installation and configuration': true,
                'Monitoring stack (Prometheus/Grafana)': true,
                'Prometheus Exporters (node, blackbox)': true,
            },
             networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
            },
            documentation: {
                'Playbook reference (README)': true,
                'Role documentation': true
            }
        }
    },
    {
        name: 'Home Automation Hub',
        description: 'Sets up Home Assistant with secure remote access for managing your smart home.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- A registered domain name for secure remote access.\n- Any necessary USB hardware (e.g., Zigbee/Z-Wave stick) passed through to the host system.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
                'Certificate management (Let\'s Encrypt)': true,
            },
            servicePlaybooks: {
                'Docker installation and configuration': true,
            },
            appDeployments: {
                'Home automation (Home Assistant)': true,
            },
            documentation: { 'Playbook reference (README)': true },
        }
    },
    {
        name: 'Secure Development Environment',
        description: 'A self-hosted Git server (Gitea) and container platform (Docker) for a complete development workflow.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- Host with a minimum of 4GB RAM and 2 vCPUs.',
        selections: {
            baseConfig: { 'User management': true, 'Firewall configuration (UFW/firewalld)': true },
            servicePlaybooks: { 'Docker installation and configuration': true },
            databaseManagement: { 'PostgreSQL Server': true },
            appDeployments: { 'Git server (Gitea)': true },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'High-Availability Web Cluster',
        description: 'A resilient web server setup using multiple web server nodes and a central load balancer.\n\n**Requirements:**\n- Ansible 2.12+\n- Minimum of 3 hosts: 1 for HAProxy, 2+ for web nodes.\n- A Linux OS on all hosts (e.g., Ubuntu 22.04).\n- Pre-configured static IP addresses for all nodes in the cluster.',
        selections: {
            baseConfig: { 'Common role (updates, packages, SSH hardening)': true },
            networking: { 
                'Static IP configuration': true,
                'HAProxy Load Balancer': true 
            },
            servicePlaybooks: {
                'Web Server (Nginx/Apache)': true,
            },
            automationFeatures: { 'Handlers for service restarts': true },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'Managed File Server',
        description: 'A centralized file server with both NFS (for Linux) and Samba (for Windows) shares.\n\n**Requirements:**\n- Ansible 2.12+\n- A host with dedicated storage drives/disks (e.g., a separate ZFS pool or XFS volume).\n- A configured network where clients can reach the server IPs.\n- Firewall ports for NFS (2049) and Samba (445, 139) must be accessible on the network.',
        selections: {
            baseConfig: { 'File system management (mounting, formatting)': true, 'Firewall configuration (UFW/firewalld)': true },
            fileSharing: {
                'NFS server setup': true,
                'Samba file sharing': true,
            },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'Secure Container Registry',
        description: 'Deploys a private, secure Docker registry (e.g., Harbor) with authentication and SSL.\n\n**Requirements:**\n- Ansible 2.12+\n- Docker v20.10+ & Docker Compose v2.0+.\n- A host with significant storage for images and a minimum of 8GB RAM.\n- A registered domain name for SSL certificates.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: { 'Reverse proxy (Traefik/Nginx Proxy Manager)': true, 'Certificate management (Let\'s Encrypt)': true },
            servicePlaybooks: { 'Docker installation and configuration': true, 'Docker Compose deployments': true },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'High-Performance Database Cluster',
        description: 'Deploys a replicated database cluster (e.g., PostgreSQL or MariaDB) for high availability.\n\n**Requirements:**\n- Ansible 2.12+\n- Minimum of 3 hosts with low-latency networking between them.\n- Static IPs pre-configured for all database nodes.\n- SSD storage is highly recommended for database performance.',
        selections: {
            baseConfig: { 'Common role (updates, packages, SSH hardening)': true, 'Firewall configuration (UFW/firewalld)': true },
            networking: { 'Static IP configuration': true },
            databaseManagement: { 'PostgreSQL Server': true, 'Database Backups (pg_dump/mysqldump)': true },
            automationFeatures: { 'Handlers for service restarts': true },
            documentation: { 'Playbook reference (README)': true, 'Role documentation': true }
        }
    },
    {
        name: 'Secure VPN Gateway',
        description: 'Configures a dedicated server as a secure WireGuard VPN gateway for remote access.\n\n**Requirements:**\n- Ansible 2.12+\n- A dedicated host (physical or virtual) with a public-facing IP address.\n- The ability to forward a UDP port (e.g., 51820) from your router/firewall to the VPN host.',
        selections: {
            baseConfig: { 'Common role (updates, packages, SSH hardening)': true, 'Firewall configuration (UFW/firewalld)': true },
            networking: { 'WireGuard VPN server': true },
            automationFeatures: { 'Idempotent operations': true },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'Fully Managed DNS Infrastructure',
        description: 'Sets up Pi-hole/AdGuard for network-wide ad-blocking and local DNS resolution.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- A host with a pre-configured static IP address.\n- Your router/DHCP server must be configurable to point clients to this host for DNS.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: { 'Static IP configuration': true, 'DNS server (Pi-hole/AdGuard)': true, 'Reverse proxy (Traefik/Nginx Proxy Manager)': true },
            servicePlaybooks: { 'Docker installation and configuration': true },
            documentation: { 'Playbook reference (README)': true }
        }
    },
    {
        name: 'CI/CD Pipeline Setup',
        description: 'Creates a CI/CD pipeline with a Gitea Git server and a container-based automation server.\n\n**Requirements:**\n- Ansible 2.12+\n- Docker & Docker Compose installed on the target host.\n- A host with a minimum of 8GB RAM and 4 vCPUs.\n- A registered domain name for accessing UI services.',
        selections: {
            baseConfig: { 'User management': true, 'Firewall configuration (UFW/firewalld)': true },
            servicePlaybooks: { 'Docker installation and configuration': true, 'Docker Compose deployments': true },
            databaseManagement: { 'PostgreSQL Server': true },
            appDeployments: { 'Git server (Gitea)': true },
            securityHardening: { 'Secrets Management (Ansible Vault)': true },
            documentation: { 'Playbook reference (README)': true, 'Role documentation': true, 'Best practices guide': true }
        }
    },
    {
        name: 'Automated Media Acquisition Stack',
        description: 'Deploys the full "arr" suite (Sonarr, Radarr, Prowlarr) and a download client using Docker.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker (e.g., Ubuntu 22.04).\n- A registered domain name for secure remote access.\n- Sufficient storage for media and downloads, ideally on a separate volume/share.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
                'Certificate management (Let\'s Encrypt)': true,
            },
            servicePlaybooks: {
                'Docker installation and configuration': true,
                'Docker Compose deployments': true,
            },
            fileSharing: { 'NFS server setup': true },
            documentation: { 'Playbook reference (README)': true },
        }
    },
    {
        name: 'Self-Hosted Cloud Suite',
        description: 'Deploys Nextcloud for a full-featured productivity and file-syncing platform.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker.\n- A registered domain name for secure access.\n- Host with a minimum of 4GB RAM.\n- A dedicated database and Redis instance for performance.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
                'Certificate management (Let\'s Encrypt)': true,
            },
            servicePlaybooks: {
                'Docker installation and configuration': true,
                'Docker Compose deployments': true,
            },
            databaseManagement: {
                'PostgreSQL Server': true,
                'Redis Server': true,
            },
            documentation: { 'Playbook reference (README)': true, 'Role documentation': true },
        }
    },
    {
        name: 'Centralized Logging Platform',
        description: 'Sets up a powerful EFK stack (Elasticsearch, Fluentd, Kibana) for centralized log aggregation and analysis.\n\n**Requirements:**\n- Ansible 2.12+\n- A host with significant resources: 16GB+ RAM, 4+ vCPUs, and fast storage (SSD) are highly recommended.\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).',
        selections: {
            baseConfig: { 'Common role (updates, packages, SSH hardening)': true },
            servicePlaybooks: {
                'Docker installation and configuration': true,
                'Docker Compose deployments': true,
            },
            documentation: { 'Playbook reference (README)': true },
            testing: { 'Lint checks (ansible-lint)': true },
        }
    },
    {
        name: 'Dedicated Game Server Manager',
        description: 'Deploys a web-based game server management panel like Pterodactyl for easy administration of game servers.\n\n**Requirements:**\n- Ansible 2.12+\n- A host with sufficient CPU and RAM for the games you intend to run.\n- A host OS compatible with Docker (e.g., Ubuntu 22.04, Debian 11, CentOS 8+).\n- A registered domain name for the panel UI.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: { 'Reverse proxy (Traefik/Nginx Proxy Manager)': true },
            servicePlaybooks: {
                'Docker installation and configuration': true,
                'Docker Compose deployments': true,
            },
            databaseManagement: { 'Redis Server': true },
            documentation: { 'Playbook reference (README)': true },
        }
    },
    {
        name: 'Personal Finance Hub',
        description: 'Deploys a self-hosted finance manager like Firefly III for private and secure budget tracking.\n\n**Requirements:**\n- Ansible 2.12+\n- A host OS compatible with Docker.\n- A registered domain name for secure remote access.\n- A dedicated database server.',
        selections: {
            baseConfig: { 'Firewall configuration (UFW/firewalld)': true },
            networking: {
                'Reverse proxy (Traefik/Nginx Proxy Manager)': true,
                'Certificate management (Let\'s Encrypt)': true,
            },
            servicePlaybooks: { 'Docker installation and configuration': true },
            databaseManagement: { 'PostgreSQL Server': true },
            documentation: { 'Playbook reference (README)': true },
        }
    }
];


export const PLAYBOOK_OPTIONS = {
    baseConfig: {
        title: 'Base Configuration',
        description: 'Establish a rock-solid foundation for all your servers. These roles handle core system-level setup, from security and user access to package management, ensuring every machine is stable, secure, and consistently configured before any applications are deployed.',
        options: [
            { label: 'Common role (updates, packages, SSH hardening)', tooltip: 'A foundational role that updates all packages, installs essential utilities (e.g., curl, git, htop), and applies key SSH security settings like disabling root login and password authentication.' },
            { label: 'Ansible Collection Management', tooltip: 'This role ensures all necessary Ansible collections (e.g., community.docker, community.general) are installed on the control node using `ansible-galaxy` before any other playbook tasks begin, ensuring dependency compliance.' },
            { label: 'User management', tooltip: 'Creates and manages user accounts, groups, and sudo permissions. Key variables: `users` (a list of user objects with names, groups, and ssh_keys). Ensures consistent user access across all your servers.' },
            { label: 'Firewall configuration (UFW/firewalld)', tooltip: 'Sets up and configures the system firewall based on the OS. Define allowed ports and services using variables to secure your hosts, e.g., allowing SSH and HTTP/S traffic.' },
            { label: 'File system management (mounting, formatting)', tooltip: 'Manages disks and file systems. Automates formatting new disks (e.g., with ext4 or xfs) and mounting them persistently via /etc/fstab, ideal for dedicated data drives.' },
            { label: 'Time synchronization (chrony)', tooltip: 'Ensures accurate system time by configuring the chrony service to sync with reliable time servers. Crucial for logging, authentication, and services like Kubernetes.' },
            { label: 'Systemd Service Management', tooltip: 'Manages systemd services, enabling tasks like starting, stopping, enabling, and disabling services to ensure they are in the desired state.' },
            { label: 'Cloud-init configuration', tooltip: 'Configures cloud-init for first-boot setup of cloud or virtualized instances, allowing for automated network configuration, user creation, and package installation.' },
        ]
    },
    networking: {
        title: 'Networking',
        description: "Configure all aspects of your homelab's network. This category covers everything from assigning static IPs to setting up advanced services like VPNs for secure remote access and reverse proxies to safely expose your applications to the internet with automated SSL.",
        options: [
            { label: 'Static IP configuration', tooltip: 'Configures static IP addresses for servers using netplan or ifupdown. Essential for services that need a stable, predictable network location.' },
            { label: 'DNS server (Pi-hole/AdGuard)', tooltip: 'Installs a network-wide ad-blocking DNS server and configures local DNS records (e.g., grafana.homelab). Requires a static IP on the host.' },
            { label: 'Reverse proxy (Traefik/Nginx Proxy Manager)', tooltip: 'Deploys a reverse proxy to manage incoming traffic, route requests to backend services, and handle SSL termination automatically. Simplifies exposing services securely.' },
            { label: 'Certificate management (Let\'s Encrypt)', tooltip: 'Automates obtaining and renewing free SSL/TLS certificates from Let\'s Encrypt using Certbot. Ensures all your web services are served over HTTPS.' },
            { label: 'WireGuard VPN server', tooltip: 'Sets up a secure and fast WireGuard VPN server, allowing you to remotely access your homelab network as if you were at home.' },
            { label: 'HAProxy Load Balancer', tooltip: 'Installs and configures HAProxy for high-availability load balancing across multiple backend servers, crucial for scaling services like web servers or Kubernetes clusters.' },
        ]
    },
    servicePlaybooks: {
        title: 'Service Playbooks',
        description: 'Deploy the core infrastructure services that power your homelab. This includes container platforms like Docker, monitoring stacks, and web servers that your applications will rely on.',
        options: [
            { label: 'Web Server (Nginx/Apache)', tooltip: 'Installs and aiconfigures a web server. Define virtual hosts, SSL certificates, and proxy settings using variables. Essential for hosting websites or as a reverse proxy.' },
            { label: 'Docker installation and configuration', tooltip: 'Installs Docker Engine and Docker Compose, and adds users to the `docker` group for non-root access. The foundation for a containerized homelab.' },
            { label: 'Docker Compose deployments', tooltip: 'Deploys containerized applications defined in a docker-compose.yml file. This role can pull a Compose file from a Git repo and launch the application stack.' },
            { label: 'Kubernetes (k3s) cluster setup', tooltip: 'Deploys a lightweight, production-ready k3s Kubernetes cluster. Automates the setup of master and agent nodes for container orchestration.' },
            { label: 'Monitoring stack (Prometheus/Grafana)', tooltip: 'Deploys a full monitoring stack with Prometheus for metrics collection and Grafana for visualization.' },
            { label: 'Prometheus Exporters (node, blackbox)', tooltip: 'Deploys common exporters to collect metrics. node-exporter gathers hardware and OS metrics from your hosts. blackbox-exporter allows probing of endpoints over HTTP, HTTPS, DNS, TCP and ICMP.' },
            { label: 'DNS Record Management', tooltip: 'Manages DNS records (A, CNAME, etc.) with providers like Cloudflare or Route53, allowing you to automatically create and update DNS entries for your services.' },
            { label: 'Container Registry (Docker Registry/Harbor)', tooltip: 'Deploys a private container registry to store and manage your Docker images securely within your own infrastructure.' },
        ]
    },
    fileSharing: {
        title: 'File Sharing',
        description: 'Set up centralized network storage solutions. These roles configure popular file sharing protocols, making it easy to create shared network drives accessible from Linux, Windows, and other devices on your network.',
        options: [
            { label: 'NFS server setup', tooltip: 'Configures a Network File System (NFS) server. Ideal for creating shared network storage for media files or as persistent volumes for Docker and Kubernetes.' },
            { label: 'Samba file sharing', tooltip: 'Sets up a Samba server for Windows-compatible file sharing, making it easy to share files between Linux and Windows machines on your network.' },
        ]
    },
     databaseManagement: {
        title: 'Database Management',
        description: 'Automate the installation, configuration, and maintenance of various database systems. Use these roles to create users, set up databases, and configure automated backup jobs to protect your critical data.',
        options: [
            { label: 'PostgreSQL Server', tooltip: 'Installs and configures a PostgreSQL database server. The role can handle package installation, database creation, and user management based on variables.' },
            { label: 'MariaDB/MySQL Server', tooltip: 'Installs and configures a MariaDB or MySQL server, including security hardening (e.g., running mysql_secure_installation) and creating databases and users.' },
            { label: 'Database Backups (pg_dump/mysqldump)', tooltip: 'Sets up automated daily backups for your databases using cron and standard database tools. The playbook should handle the backup script and cron job creation.' },
            { label: 'Redis Server', tooltip: 'Installs and configures Redis, an in-memory data store, including persistence and network binding settings.' },
        ]
    },
    appDeployments: {
        title: 'Application Deployments',
        description: 'Deploy popular self-hosted applications with a single click. These roles automate the entire setup process, including dependencies, reverse proxy configurations, and persistent storage for a turnkey experience.',
        options: [
            { label: 'Media server (Plex/Jellyfin)', tooltip: 'Deploys a media server in a Docker container, mounting media directories from an NFS share and configuring hardware transcoding if available.' },
            { label: 'Home automation (Home Assistant)', tooltip: 'Installs Home Assistant in a Docker container and exposes it securely to the internet via a reverse proxy with SSL.' },
            { label: 'Git server (Gitea)', tooltip: 'Deploys Gitea, a lightweight self-hosted Git service, using Docker Compose. Includes setting up a database and persistent storage volumes.' },
            { label: 'CI/CD Pipeline', tooltip: 'Deploys a CI/CD solution like GitLab CI, GitHub Actions Runner, or Jenkins. This can be integrated with Gitea and a container registry for automated build and deployment pipelines.' },
        ]
    },
    automationFeatures: {
        title: 'Automation Features',
        description: 'Incorporate advanced Ansible features to build more dynamic, secure, and efficient automation. These options help you manage secrets, run targeted playbook executions, and integrate with GitOps workflows.',
        options: [
            { label: 'Dynamic inventory (script-based)', tooltip: 'Use a custom script to generate your inventory. A simple script could just output JSON. A more complex example:\n\n#!/bin/bash\ncat <<EOF\n{\n  "_meta": {\n    "hostvars": {\n      "web1.example.com": {\n        "ansible_host": "192.168.1.10"\n      },\n      "db1.example.com": {\n        "ansible_host": "192.168.1.20"\n      }\n    }\n  },\n  "all": {\n    "children": [\n      "ungrouped",\n      "linux"\n    ]\n  },\n  "linux": {\n    "children": [\n        "webservers",\n        "databases"\n    ]\n  },\n  "webservers": {\n    "hosts": [\n      "web1.example.com"\n    ]\n  },\n  "databases": {\n    "hosts": [\n      "db1.example.com"\n    ]\n  }\n}\nEOF' },
            { label: 'Configuration Management Tool (e.g., Ansible Tower/AWX, Rundeck)', tooltip: 'These tools extend Ansible by providing centralized control, job scheduling, and a UI for playbook execution, allowing teams to manage automation workflows more efficiently.' },
            { label: 'Tag-based execution', tooltip: 'Adds tags to tasks and roles (e.g., `packages`, `users`, `docker`) so you can run specific parts of the playbook, like `ansible-playbook site.yml --tags docker`.' },
            { label: 'Handlers for service restarts', tooltip: 'Uses handlers to restart services only when their configuration files have actually changed. This is more efficient and reliable than restarting services on every run.' },
            { label: 'Idempotent operations', tooltip: 'Guarantees that running a playbook multiple times results in the same system state, ensuring predictable and reliable automation without unintended side effects.' },
            { label: 'GitOps integration (Argo CD/Flux)', tooltip: 'Integrates your Ansible setup with a GitOps workflow. This can involve generating Kubernetes manifests for Argo CD or Flux to deploy the applications, treating your Git repository as the single source of truth for your infrastructure.' },
            { label: 'Ansible Vault UI integration', tooltip: 'Deploys a web UI for Ansible Vault (e.g., vault-ui) to manage encrypted secrets through a browser, providing a more user-friendly alternative to the command line.' },
        ]
    },
    securityHardening: {
        title: 'Security Hardening',
        description: 'Apply security best practices to lock down your systems. This section includes roles for implementing CIS benchmarks, monitoring for unauthorized file changes, and other critical security measures to protect your homelab from threats.',
        options: [
            { label: 'Security hardening (CIS benchmarks)', tooltip: 'Applies security best practices from CIS (Center for Internet Security) benchmarks, such as disabling unused filesystems, configuring auditd for monitoring, and setting strict file permissions.' },
            { label: 'File integrity monitoring (AIDE/Tripwire)', tooltip: 'Installs and configures a host-based intrusion detection system like AIDE to create a baseline of critical system files and detect unauthorized changes.' },
            { label: 'Ansible Vault integration', tooltip: 'Uses Ansible Vault to encrypt files containing sensitive data (e.g., passwords, API keys). The generated playbook will be structured to use placeholders like `{{ vault_db_password }}`, ensuring secrets are never stored in plaintext.' },
        ]
    },
    testing: {
        title: 'Testing',
        description: 'Integrate testing, linting, and validation tools into your workflow. Adopting these practices ensures your automation code is reliable, free of common errors, and adheres to community best practices from the start.',
        options: [
            { label: 'Ansible Lint configuration', tooltip: 'Includes a configuration file for `ansible-lint` to automatically check your playbooks for bugs, stylistic errors, and deviations from best practices.' },
            { label: 'YAML Linting', tooltip: "Uses 'yamllint' to check YAML file syntax for consistency and correctness." },
            { label: 'Pre-commit hooks', tooltip: 'Sets up a .pre-commit-config.yaml file to automate code quality checks on every commit. Example:\n\nrepos:\n- repo: https://github.com/pre-commit/pre-commit-hooks\n  rev: v4.3.0\n  hooks:\n  - id: check-yaml\n  - id: end-of-file-fixer\n  - id: trailing-whitespace\n- repo: https://github.com/ansible/ansible-lint\n  rev: v6.8.2\n  hooks:\n  - id: ansible-lint' },
        ]
    },
    documentation: {
        title: 'Documentation',
        description: 'Generate clear and comprehensive documentation alongside your code. This makes your playbooks easier for you and others to understand, use, and maintain over time.',
        options: [
            { label: 'Playbook reference (README)', tooltip: 'Generates a detailed README.md with a quick start guide, inventory setup instructions, variable explanations, and execution examples.' },
            { label: 'Role documentation', tooltip: `Creates a separate, detailed README.md inside each role's directory (\`roles/<role_name>/README.md\`). This file serves as the primary documentation for the role.

A well-structured role README should contain:

- **Parameters:** A list of all configurable variables for the role, including their type, a description, and the default value. Required variables should be clearly marked.
- **Dependencies:** This section details other roles that must be run first. This can be informational or enforced via \`meta/main.yml\`.
- **Usage Examples:** Concrete examples of how to use the role in a playbook.

---

**Example: \`roles/gitea/README.md\`**

# Role: Gitea

Deploys Gitea, a self-hosted Git service, using Docker.

## Parameters

- \`gitea_domain\`: (string, **required**) The fully qualified domain name for Gitea (e.g., \`git.example.com\`).
- \`gitea_db_password\`: (string, **required**) The password for the Gitea database user. **Note:** Should be stored in Ansible Vault.
- \`gitea_admin_user\`: (string) The username for the initial admin account (default: \`gitea_admin\`).

## Dependencies

This role requires a container runtime and a database. Dependencies can be formally declared in \`meta/main.yml\` to ensure they are executed in the correct order.

**Example \`meta/main.yml\`:**
\`\`\`yaml
dependencies:
  - role: docker
  - role: postgresql
    vars:
      postgresql_users:
        - name: gitea
          password: "{{ gitea_db_password }}"
      postgresql_databases:
        - name: gitea
          owner: gitea
\`\`\`

## Usage Examples

**1. Basic Deployment:**
Deploy Gitea with a PostgreSQL database on the same host.

\`\`\`yaml
- hosts: gitea_server
  roles:
    - role: gitea
      vars:
        gitea_domain: "git.homelab.local"
        gitea_db_password: "{{ vault_gitea_db_pass }}"
\`\`\`
` },
            { label: 'Variable reference', tooltip: 'Generates a `variables.md` file that provides a single reference for all tunable parameters. Example of the generated output:\n\n## Nginx\n\n- `nginx_port`\n  - **Description:** The port Nginx will listen on.\n  - **Default:** `80`\n- `nginx_proxy_settings`:\n  - **Description:** Nested dictionary for proxy configuration.\n  - **Default:**\n    ```yaml\n    proxy_connect_timeout: 600\n    proxy_send_timeout: 600\n    ```' },
            { label: 'Best practices guide', tooltip: 'Adds a section or file (e.g., CONTRIBUTING.md) with guidelines on code style, commit messages, and branching strategy to maintain a high-quality project.' },
        ]
    },
    advancedConfiguration: {
        title: 'Advanced Configuration',
        description: 'Fine-tune your playbook with advanced options. This section allows for more complex setups, such as overriding default configurations using external custom variable files.',
        options: [
            { label: 'Custom Variables File', tooltip: 'Configures the main playbook to load an external file (e.g., `vars/custom.yml`) for user-defined variables, making it easy to override defaults without modifying the roles.' },
        ]
    }
};
