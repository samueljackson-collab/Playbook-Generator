
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
            { label: 'Web Server Role (Nginx/Apache)', tooltip: 'Installs and configures a web server, e.g., setting up a virtual host for myapp.local with PHP-FPM.' },
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
    },
    sdePlaybooks: {
        title: 'System Design Engineering (SDE) Playbooks',
        subsections: [
            {
                title: 'Infrastructure & Architecture',
                options: [
                    { label: 'Microservices infrastructure setup (Docker/K8s)', tooltip: 'Provisions the networking, namespaces, and service discovery components needed to run microservices, e.g., configuring CoreDNS and Flannel CNI in a K8s cluster.' },
                    { label: 'API Gateway deployment (Kong/Traefik)', tooltip: 'Deploys an API gateway to centralize routing, authentication, and rate-limiting, e.g., configuring Kong with a PostgreSQL backend and declarative route definitions.' },
                    { label: 'Service mesh setup (Istio/Linkerd with mTLS)', tooltip: 'Installs a service mesh for encrypted service-to-service communication, observability, and traffic management, e.g., deploying Istio with mTLS enforced across all workloads.' },
                    { label: 'Message queue deployment (RabbitMQ/Kafka)', tooltip: 'Deploys a message broker for async inter-service communication, e.g., setting up a 3-node Kafka cluster with Zookeeper and creating initial topics.' },
                    { label: 'Load balancer configuration (HAProxy/Nginx upstream pools)', tooltip: 'Configures a software load balancer to distribute traffic across backend instances, e.g., setting up HAProxy with health checks and round-robin balancing across app servers.' },
                ]
            },
            {
                title: 'Database & Storage',
                options: [
                    { label: 'Distributed database cluster (PostgreSQL HA with replication)', tooltip: 'Sets up a highly available PostgreSQL cluster with streaming replication, e.g., configuring a primary and two replicas with automatic failover via Patroni.' },
                    { label: 'Redis cache cluster deployment', tooltip: 'Deploys a Redis cluster or Sentinel setup for high-availability caching, e.g., configuring 3 Redis nodes in cluster mode with persistence and eviction policies.' },
                    { label: 'Object storage setup (MinIO S3-compatible)', tooltip: 'Installs and configures MinIO as an S3-compatible object store, e.g., deploying a distributed MinIO instance with TLS and creating initial buckets via the mc client.' },
                ]
            },
            {
                title: 'Developer Tooling',
                options: [
                    { label: 'CI/CD pipeline infrastructure (Jenkins/GitLab Runner)', tooltip: 'Provisions CI/CD infrastructure, e.g., installing a Jenkins controller with agents or registering GitLab Runners with Docker executor on target hosts.' },
                    { label: 'Container registry deployment (Harbor/Docker Registry)', tooltip: 'Deploys a private container registry, e.g., setting up Harbor with vulnerability scanning (Trivy) and configuring Docker daemons to trust the registry certificate.' },
                    { label: 'Code quality platform (SonarQube)', tooltip: 'Deploys SonarQube for static code analysis, e.g., installing SonarQube with a PostgreSQL database and configuring project tokens for CI/CD integration.' },
                ]
            },
        ]
    },
    desktopSupportPlaybooks: {
        title: 'Desktop Support Technician Playbooks',
        subsections: [
            {
                title: 'Workstation Configuration',
                options: [
                    { label: 'Workstation base configuration (hostname, DNS, NTP)', tooltip: 'Applies a standard baseline to new workstations: sets the hostname, configures DNS resolvers, syncs time via NTP/chrony, and installs common utilities.' },
                    { label: 'Corporate software deployment (browsers, office suite, productivity apps)', tooltip: 'Installs and configures a standard software stack, e.g., deploying Google Chrome, LibreOffice, and Slack via package manager or installer scripts.' },
                    { label: 'Printer and peripheral driver setup', tooltip: 'Installs printer drivers and configures CUPS print queues, e.g., adding a network printer by IP and setting it as the system default.' },
                    { label: 'VPN client deployment and profile configuration', tooltip: 'Installs a VPN client (e.g., OpenVPN or WireGuard) and deploys connection profiles, e.g., pushing a company WireGuard config and enabling the service at login.' },
                    { label: 'Remote support tools setup (RDP/VNC/TeamViewer)', tooltip: 'Installs and configures remote access tooling, e.g., enabling xrdp on Linux workstations or deploying the TeamViewer Host package with a predefined account assignment.' },
                ]
            },
            {
                title: 'User & Access Management',
                options: [
                    { label: 'Active Directory / LDAP client integration', tooltip: 'Joins Linux workstations to Active Directory using realmd/sssd, e.g., configuring sssd.conf with the AD domain and enabling home directory auto-creation on login.' },
                    { label: 'Local password policy and account lockout enforcement', tooltip: 'Configures PAM to enforce password complexity and account lockout policies, e.g., requiring 12-character passwords with pam_pwquality and locking after 5 failed attempts.' },
                    { label: 'User account provisioning and deprovisioning', tooltip: 'Automates creating and removing user accounts, e.g., onboarding a new employee by creating a local account, setting a temporary password, and adding them to required groups.' },
                    { label: 'Sudo and privilege management (Linux)', tooltip: 'Manages sudoers rules to grant or restrict elevated privileges, e.g., allowing the helpdesk group to restart specific services without a full root shell.' },
                ]
            },
            {
                title: 'Maintenance & Troubleshooting',
                options: [
                    { label: 'Patch management and automated OS updates', tooltip: 'Automates package updates and reboots on a schedule, e.g., running unattended-upgrades and rebooting workstations during a maintenance window if a kernel update was applied.' },
                    { label: 'System diagnostics and log collection for support tickets', tooltip: 'Collects system information (journalctl, dmesg, hardware info, network state) from remote hosts and archives them locally for troubleshooting support tickets.' },
                    { label: 'Disk cleanup, temp file removal, and optimization', tooltip: 'Frees disk space on workstations by clearing package caches, purging old kernels, removing temp files, and reporting freed space, e.g., using apt autoremove and journald vacuum.' },
                    { label: 'Hardware inventory and system info collection', tooltip: 'Gathers detailed hardware facts (CPU, RAM, disk, NIC) using dmidecode and lshw, then saves structured output to a centralized inventory file or CMDB.' },
                ]
            },
        ]
    },
    grcPlaybooks: {
        title: 'GRC (Governance, Risk & Compliance) Playbooks',
        subsections: [
            {
                title: 'Compliance Framework Controls',
                options: [
                    { label: 'CIS Controls implementation (Levels 1 & 2)', tooltip: 'Applies CIS Benchmark hardening for the target OS (Ubuntu/RHEL), e.g., disabling unused services, configuring auditd rules, restricting cron, and enforcing secure SSH settings per CIS Level 1 and 2 profiles.' },
                    { label: 'NIST SP 800-53 control automation', tooltip: 'Implements selected NIST 800-53 technical controls, e.g., automating AC-2 (account management), AU-2 (audit events), and SC-28 (data at rest encryption) for a moderate-impact system.' },
                    { label: 'PCI-DSS compliance hardening (cardholder data environment)', tooltip: 'Applies PCI-DSS technical requirements to systems in the CDE, e.g., enabling firewall rules to restrict inbound access, disabling insecure protocols (Telnet, SSLv3), and ensuring logging is active.' },
                    { label: 'HIPAA Security Rule technical safeguards', tooltip: 'Configures technical safeguards required by HIPAA, e.g., enforcing access controls (164.312(a)(1)), enabling audit logging (164.312(b)), and ensuring transmission encryption (164.312(e)(1)) for servers handling ePHI.' },
                    { label: 'SOC 2 Type II controls implementation', tooltip: 'Implements controls relevant to SOC 2 Trust Service Criteria, e.g., enforcing MFA at the OS level, configuring monitoring and alerting for CC7.2, and documenting change management procedures.' },
                    { label: 'ISO 27001 Annex A controls automation', tooltip: 'Automates Annex A technical controls such as A.9 (access control), A.12 (operations security), and A.14 (system acquisition), e.g., configuring password policies, patch management, and audit logging.' },
                ]
            },
            {
                title: 'Audit & Evidence Collection',
                options: [
                    { label: 'Compliance audit report generation (HTML/JSON output)', tooltip: 'Runs compliance checks against configured baselines and generates structured reports (HTML or JSON) that can be attached as evidence in audit packages.' },
                    { label: 'Evidence collection and archiving for auditors', tooltip: 'Gathers configuration snapshots, log excerpts, and policy outputs from target hosts and archives them with timestamps into a structured evidence directory for auditor review.' },
                    { label: 'Configuration drift detection and remediation', tooltip: 'Compares current system state against a known-good baseline and reports or auto-remediates drift, e.g., detecting unauthorized sudoers changes or missing auditd rules.' },
                    { label: 'Audit log aggregation, forwarding, and retention enforcement', tooltip: 'Configures auditd, rsyslog, or journald to forward logs to a central SIEM or log store, and enforces retention policies (e.g., 365-day minimum) to meet compliance requirements.' },
                ]
            },
            {
                title: 'Risk & Vulnerability Management',
                options: [
                    { label: 'Vulnerability scanning automation (OpenVAS/Nessus integration)', tooltip: 'Automates vulnerability scans on a schedule using OpenVAS or triggers Nessus scans via API, then retrieves and archives scan reports for risk tracking.' },
                    { label: 'Patch compliance verification and reporting', tooltip: 'Checks all managed hosts for outstanding security patches and generates a compliance report showing patched vs. unpatched systems, suitable for a risk register update.' },
                    { label: 'Security baseline enforcement and validation', tooltip: 'Applies and validates a defined security baseline (e.g., DISA STIG or internal policy) on hosts, reporting any deviations and optionally auto-remediating them.' },
                    { label: 'IT asset inventory and classification', tooltip: 'Discovers and records system attributes (OS version, installed software, open ports, user accounts) from managed hosts and outputs a structured asset inventory for the CMDB or risk assessments.' },
                ]
            },
            {
                title: 'Policy Enforcement',
                options: [
                    { label: 'Password and account policy enforcement', tooltip: 'Enforces organizational password policies via PAM and shadow configuration, e.g., setting minimum length, complexity, maximum age, and account inactivity lockout thresholds across all managed hosts.' },
                    { label: 'File integrity monitoring setup (AIDE/Tripwire)', tooltip: 'Installs and initializes a file integrity monitor (AIDE or Tripwire), schedules daily database checks, and configures alerting on unexpected changes to critical system files.' },
                    { label: 'Removable media and USB control policies', tooltip: 'Disables or restricts USB storage device access via udev rules or kernel module blacklisting, e.g., blacklisting the usb-storage module on workstations that should not allow external drives.' },
                ]
            },
        ]
    },
};