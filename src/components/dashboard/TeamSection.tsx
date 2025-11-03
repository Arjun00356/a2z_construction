import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, Users, Mail, Phone, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TeamSection = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .order('full_name');
    
    if (!error) setTeam(data || []);
    setLoading(false);
  };

  const getRoleBadge = (roles: any[]) => {
    if (!roles || roles.length === 0) return <Badge variant="outline">User</Badge>;
    
    const roleColors: any = {
      admin: 'bg-red-500/20 text-red-500',
      engineer: 'bg-blue-500/20 text-blue-500',
      user: 'bg-gray-500/20 text-gray-500'
    };

    return roles.map((r, i) => (
      <Badge key={i} className={roleColors[r.role] || 'bg-gray-500/20 text-gray-500'}>
        {r.role}
      </Badge>
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Team Members</h2>
        <p className="text-muted-foreground mt-1">Your construction team directory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <Card key={member.id} className="glass-card border-primary/20 p-6 hover:border-accent transition-all">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background font-semibold">
                  {getInitials(member.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{member.full_name}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getRoleBadge(member.user_roles)}
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-3 h-3" />
                      <span>{member.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
