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
        ansible.provisioning_path = "/project"
        ansible.playbook = "vagrant/provision.yml"
    end

    config.ssh.forward_agent = true

end
