# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "debian/stretch64"
  config.vm.hostname = 'queue.dev.interal'

  if RUBY_PLATFORM =~ /darwin/
    config.vm.synced_folder '.', '/project', type: 'sshfs'
  else
    config.vm.synced_folder '.', '/project'
  end

  config.vm.provision "ansible_local" do |ansible|
    ansible.version = "2.5.11"
    ansible.install_mode = "pip"
    ansible.provisioning_path = "/project"
    ansible.galaxy_role_file = "vagrant/ansible-requirements.yml"
    ansible.playbook = "vagrant/provision.yml"
  end

  config.ssh.forward_agent = true
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3306, host: 3306
end
