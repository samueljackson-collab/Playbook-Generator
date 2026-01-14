
export const PLAYBOOK_OPTIONS = {
    baseConfig: {
        title: 'Base Configuration',
        options: [
            { label: 'Common role (updates, packages, SSH hardening)', tooltip: 'A foundational role that updates the OS, installs common utilities (e.g., curl, git, vim), and applies basic SSH security settings like disabling root login.' },
            { label: 'Package Management Role (apt/dnf based on OS)', tooltip: 'Installs and manages packages. Use variables to define package lists, e.g., a `base_packages` variable with [\'htop\', \'unzip\', \'jq\'].' },
            { label: 'User management', tooltip: 'Manages user accounts and permissions, e.g., creating a \'dev\' group with sudo access or creating system users for running services.' },
            { label: 'SSH key management', tooltip: 'Manages authorized SSH keys for users to enable secure, passwordless access, e.g., distributing your public key to ~/.ssh/authorized_keys.' },
            { label: 'Firewall configuration (UFW/firewalld)', tooltip: 'Sets up the system firewall, e.g., allowing SSH (port 22) and restricting database ports to specific IPs.' },
            { label: 'Time synchronization (chrony)', tooltip: 'Ensures accurate system time by configuring the chrony service to sync with a time server pool like pool.ntp.org.' },
            { label: 'NTP configuration', tooltip: 'Alternative to chrony, configures the standard Network Time Protocol daemon for time synchronization, e.g., by managing /etc/ntp.conf.' },
            { label: 'Log rotation', tooltip: 'Configures logrotate to manage system log files, e.g., rotating /var/log/syslog weekly, keeping 4 archives, and compressing them.' },
            { label: 'Security hardening (CIS benchmarks)', tooltip: 'Applies security best practices from CIS benchmarks, e.g., disabling unused filesystems or configuring auditd for monitoring.' },
            { label: 'SSL/TLS configuration', tooltip: 'Configures SSL/TLS certificates for secure communication, e.g., generating self-signed certificates or deploying private CA-signed certs for internal services.' },
            { label: 'SSH Host Key Checking', tooltip: 'Enforces SSH host key checking to prevent man-in-the-middle (MITM) attacks. Highly recommended for security.' },
            { label: 'Systemd Service Management', tooltip: 'Manages systemd services, e.g., enabling and starting a custom service unit or ensuring a service is stopped.' },
            { label: 'File system management (mounting, formatting)', tooltip: 'Manages file systems, e.g., formatting a new disk with ext4 and mounting it to /data, or ensuring an NFS share is mounted at boot via /etc/fstab.' },
            { label: 'User profile management (dotfiles, shell config)', tooltip: 'Manages user-specific configurations, such as deploying custom dotfiles (e.g., .bashrc, .vimrc) from a Git repository to ensure a consistent shell environment.' },
        ]
    },
    servicePlaybooks: {
        title: 'Service Playbooks',
        options: [
            { label: 'Web Server Role (Nginx/Apache)', tooltip: 'Installs and infigures a web server, e.g., setting up a virtual host for myapp.local with PHP-FPM.' },
            { label: 'Docker installation and configuration', tooltip: 'Installs Docker engine and Docker Compose, and adds users to the `docker` group for non-root access.' },
            { label: 'Docker Compose deployments', tooltip: 'Deploys containerized applications defined in a docker-compose.yml file. Ideal for multi-container services like Portainer or an ELK stack.' },
            { label: 'Kubernetes (k3s) cluster setup', tooltip: 'Deploys a lightweight k3s Kubernetes cluster, including setting up master/agent nodes and an ingress controller.' },
            { label: 'Monitoring stack deployment (Prometheus/Grafana)', tooltip: 'Sets up Prometheus and Grafana, e.g., configuring node_exporter on targets and creating a Grafana dashboard.' },
            { label: 'DNS server (Pi-hole/AdGuard)', tooltip: 'Installs a network-wide ad-blocking DNS server and configures local DNS records (e.g., grafana.homelab).' },
            { label: 'Reverse proxy (Traefik/Nginx Proxy Manager)', tooltip: 'Deploys a reverse proxy to manage traffic with automated SSL, e.g., routing plex.yourdomain.com to your Plex server.' },
            { label: 'Certificate management (Let\'s Encrypt)', tooltip: 'Automates obtaining and renewing SSL/TLS certificates and configures services to use them automatically.' },
            { label: 'NFS server setup', tooltip: 'Configures a Network File System (NFS) server, ideal for sharing directories across your network for things like media storage or persistent volumes for containers.' },
            { label: 'Samba file sharing', tooltip: 'Sets up a Samba server for Windows-compatible file sharing.' },
            { label: 'DNS Record Management', tooltip: 'Manages DNS records for homelab services, e.g., creating an A record for \'plex.homelab.local\' pointing to a specific IP address.' },
        ]
    },
    appDeployments: {
        title: 'Application Deployments',
        options: [
            { label: 'Media server (Plex/Jellyfin)', tooltip: 'Deploys a media server in a Docker container, mounting media directories and configuring hardware transcoding.' },
            { label: 'Home automation (Home Assistant)', tooltip: 'Installs Home Assistant in Docker and securely exposes it to the internet via a reverse proxy.' },
            { label: 'Photo management (Immich)', tooltip: 'Deploys Immich, a self-hosted photo backup solution, using Docker Compose with all its required services.' },
            { label: 'Password manager (Vaultwarden)', tooltip: 'Sets up Vaultwarden, a lightweight, self-hosted Bitwarden-compatible password manager, and configures SMTP for emails.' },
            { label: 'Git server (Gitea)', tooltip: 'Deploys Gitea, a lightweight self-hosted Git service.' },
        ]
    },
    automationFeatures: {
        title: 'Automation Features',
        options: [
            { label: 'Dynamic inventory (Proxmox plugin)', tooltip: 'Configures Ansible to dynamically discover hosts from Proxmox based on guest properties, resource pools, or tags.' },
            { label: 'Dynamic inventory (script-based)', tooltip: 'Use a custom script (e.g., Python, Bash) to generate your inventory from any source like a CMDB, cloud API, or even a simple text file.' },
            { label: 'Dynamic inventory (cloud provider)', tooltip: 'Integrates with inventory plugins for cloud providers like AWS, Azure, or GCP to dynamically discover hosts based on tags or other metadata.' },
            { label: 'Vault integration for secrets', tooltip: 'Includes placeholders for Ansible Vault (e.g., {{ vault_db_password }}) to avoid committing secrets to version control.' },
            { label: 'Ansible Vault UI integration', tooltip: 'Provides guidance on integrating with a UI or centralized secret store like HashiCorp Vault or CyberArk.' },
            { label: 'Tag-based execution', tooltip: 'Structures the playbook with tags to run specific parts, e.g., `ansible-playbook site.yml --tags postgres` to only update databases.' },
            { label: 'Check mode (dry-run) support', tooltip: 'Ensures playbooks can be run with `--check` to safely validate your changes before applying them.' },
            { label: 'Handlers for service restarts', tooltip: 'Uses handlers to restart services only when their configuration changes, e.g., a handler to restart nginx only if its config is updated.' },
            { label: 'Idempotent operations', tooltip: 'Guarantees that running a playbook multiple times results in the same state, ensuring predictable and reliable automation.' },
            { label: 'GitOps integration (Argo CD/Flux)', tooltip: 'Prepares the playbook structure for GitOps tools like Argo CD or Flux, enabling automated deployments triggered by commits to a Git repository.' },
        ]
    },
    testing: {
        title: 'Testing',
        options: [
            { label: 'Molecule tests', tooltip: 'Generates a Molecule framework to automate testing roles across different distributions and scenarios.' },
            { label: 'Lint checks (ansible-lint)', tooltip: 'Includes a configuration for ansible-lint to automatically check for bugs, stylistic issues, and bad practices.' },
            { label: 'YAML syntax validation', tooltip: 'Adds a basic script or pre-commit hook to validate YAML syntax and catch errors before runtime.' },
            { label: 'Test environments (Vagrant/Docker)', tooltip: 'Provides a Vagrantfile or Dockerfile to create consistent and reproducible environments for development and testing.' },
            { label: 'Pre-commit hooks', tooltip: 'Automates linting on commit. Sets up `.pre-commit-config.yaml` with hooks for `ansible-lint` and `yamllint`. You can easily add more hooks for tools like `prettier` (for Markdown) or `shellcheck` (for shell scripts).' }
        ]
    },
    documentation: {
        title: 'Documentation',
        options: [
            { label: 'Playbook reference (README)', tooltip: 'Generates a detailed README.md with a quick start guide, inventory setup instructions, and variable explanations.' },
            { label: 'Role documentation', tooltip: 'Creates separate README files within each role explaining its purpose, variables, dependencies, and an example.' },
            { label: 'Variable reference', tooltip: 'Generates a centralized document providing a single source of truth for all tunable parameters in your automation.' },
            { label: 'Usage examples', tooltip: 'Includes practical examples in the documentation, such as deploying a new application or performing routine maintenance.' },
            { label: 'Best practices guide', tooltip: 'Adds a section or file (e.g., CONTRIBUTING.md) with guidelines on code style to maintain a high-quality project.' },
        ]
    },
    advancedConfiguration: {
        title: 'Advanced Configuration',
        options: [
            { label: 'Custom Variables File', tooltip: 'Allows users to specify a path to an external file for custom variables.' },
        ]
    }
};