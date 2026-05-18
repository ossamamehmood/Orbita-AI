import * as React from "react";
import { 
  User, 
  Shield, 
  Bell, 
  Monitor, 
  Database, 
  Globe, 
  Cpu,
  Lock,
  Eye,
  Settings as SettingsIcon,
  ChevronRight,
  Trash2,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hooks/useTasks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { userProfile, updateProfile, resetSystem, confirmAction } = useTasks();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPurge = () => {
    confirmAction({
      title: "Decommission Entire System?",
      description: "You are about to initiate a full system purge. This will permanently remove all tasks, workspaces, and operator profile data from the neural registry.",
      impact: "Total reset of all stored productivity data. Systems will reboot to factory state.",
      confirmText: "Purge Neural Registry",
      onConfirm: () => resetSystem()
    });
  };

  const sections = [
    {
      title: "System Parameters",
      items: [
        { icon: Cpu, label: "AI Engine Configuration", value: "Gemini Pro Neural", status: "Optimal" },
        { icon: Database, label: "Data Synchronicity", value: "Cloud Mesh", status: "Active" },
        { icon: Globe, label: "Network Localization", value: "Global Grid", status: "Connected" },
      ]
    },
    {
      title: "Security Protocols",
      items: [
        { icon: Shield, label: "Neural Encryption", value: "AES-512 Quantum", status: "Enabled" },
        { icon: Lock, label: "Access Control", value: "Biometric Identity", status: "Verified" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[2rem] glass-glossy futuristic-gradient flex items-center justify-center shadow-2xl">
            <SettingsIcon className="text-white w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-display font-bold tracking-tighter text-foreground">System Config</h1>
            <p className="text-foreground/40 text-sm font-bold uppercase tracking-[0.3em]">Core Operational Parameters v4.2</p>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20 px-6">Operator Signature</h3>
        <div className="glass-glossy rounded-[3rem] p-10 border-border flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
          
          <div className="relative shrink-0 group">
            <div className="w-36 h-36 rounded-[2.5rem] p-1.5 glass-glossy border-border relative cursor-pointer overflow-hidden">
              <label className="cursor-pointer">
                <Avatar className="w-full h-full rounded-[2.2rem] border-0">
                  <AvatarImage src={userProfile.photo || undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-4xl uppercase">
                    {userProfile.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                  <Camera className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(2,254,220,0.5)]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update</span>
                </div>
                
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              </label>
            </div>
            
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-[0_0_12px_rgba(2,254,220,0.5)] z-20" />
          </div>
          
          <div className="flex-1 w-full space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 px-1">Identity Tag</label>
              <Input 
                value={userProfile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="bg-card/5 border-border rounded-2xl h-14 focus:border-primary/40 focus:ring-0 text-foreground font-bold text-xl px-6"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 px-1">Functional Directive</label>
              <Input 
                value={userProfile.bio}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                className="bg-card/5 border-border rounded-2xl h-14 focus:border-primary/40 focus:ring-0 text-foreground font-medium px-6"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-10">
        {sections.map((section, idx) => (
          <section key={idx} className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/20 px-4">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  className="group flex items-center justify-between p-7 rounded-[2.5rem] glass-glossy border-border transition-all cursor-pointer bg-card/5 hover:bg-card/10 hover:translate-x-2 shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-xl">
                      <item.icon className="w-7 h-7 text-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground tracking-tight">{item.label}</p>
                      <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest mt-1">{item.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-black">
                      {item.status}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-foreground/10 group-hover:text-foreground transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
        <Button 
          variant="ghost" 
          onClick={triggerPurge}
          className="rounded-2xl h-12 px-8 font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Purge System Registry
        </Button>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => updateProfile({ isFirstTime: true })} className="rounded-2xl h-12 px-8 font-bold text-foreground/40 hover:text-foreground transition-colors">Start Onboarding</Button>
          <Button className="rounded-2xl h-12 px-8 futuristic-gradient text-white border-0 font-bold shadow-xl shadow-primary/20">Sync Configuration</Button>
        </div>
      </div>
    </div>
  );
}
