package com.foreflight.server.chat.provision.stack;


import com.foreflight.server.provision.AccountInfrastructure;
import com.foreflight.server.provision.construct.resource.FFApplicationLoadBalancer;
import com.foreflight.server.provision.construct.resource.FFCnameRecord;
import com.foreflight.server.provision.construct.util.LookupUtils;
import com.foreflight.server.provision.starter.FFAppContext;
import com.foreflight.server.provision.starter.FFBaseStack;
import lombok.Getter;
import org.jetbrains.annotations.NotNull;
import software.amazon.awscdk.services.ec2.ISecurityGroup;
import software.amazon.awscdk.services.ec2.IVpc;
import software.amazon.awscdk.services.ec2.Peer;
import software.amazon.awscdk.services.ec2.Port;
import software.amazon.awscdk.services.ec2.SecurityGroup;
import software.amazon.awscdk.services.elasticloadbalancingv2.AddApplicationTargetGroupsProps;
import software.amazon.awscdk.services.elasticloadbalancingv2.ApplicationListener;
import software.amazon.awscdk.services.elasticloadbalancingv2.ApplicationLoadBalancer;
import software.amazon.awscdk.services.elasticloadbalancingv2.ApplicationProtocol;
import software.amazon.awscdk.services.elasticloadbalancingv2.ApplicationTargetGroup;
import software.amazon.awscdk.services.elasticloadbalancingv2.BaseApplicationListenerProps;
import software.amazon.awscdk.services.elasticloadbalancingv2.IListenerCertificate;
import software.amazon.awscdk.services.elasticloadbalancingv2.ListenerCertificate;

import java.util.Collections;

public class ChatServerStack extends FFBaseStack {

    @Getter
    private final ApplicationLoadBalancer applicationLoadBalancer;
    @Getter
    private final String cnameRecord;

    public ChatServerStack(final @NotNull FFAppContext context, final String id) {
        super(context, id);
        this.applicationLoadBalancer = createApplicationLoadBalancer();
        this.cnameRecord = createCnameRecord(applicationLoadBalancer.getLoadBalancerDnsName());

        // VPC
        IVpc vpc = LookupUtils.findVpc(this).orElseThrow();


        // Security Group for the EC2 Instance
        SecurityGroup ec2SecurityGroup = SecurityGroup.Builder.create(this, "ChatEC2SecurityGroup")
                .vpc(vpc)
                .allowAllOutbound(true)
                .build();

        // Allow HTTP traffic on port 8080 from the ALB
        for (ISecurityGroup sg : applicationLoadBalancer.getConnections().getSecurityGroups()) {
            ec2SecurityGroup.addIngressRule(Peer.securityGroupId(sg.getSecurityGroupId()), Port.tcp(8080));
        }

        // Target Group
        ApplicationTargetGroup targetGroup = ApplicationTargetGroup.Builder.create(this, "ChatTargetGroup")
                .vpc(vpc)
                .port(8080)
                .protocol(ApplicationProtocol.HTTP)
                .build();

        // Lookup the certificate by ARN
        IListenerCertificate certificate = ListenerCertificate.fromArn(AccountInfrastructure.getListenerCertificateArn(context.getAccountEnv()));

        // HTTPS Listener with SSL Certificate
        ApplicationListener listener = applicationLoadBalancer.addListener("ChatHttpsListener", BaseApplicationListenerProps.builder()
                .port(443)
                .certificates(Collections.singletonList(certificate))
                .protocol(ApplicationProtocol.HTTPS)
                .build());

        // Add Target Group to Listener
        listener.addTargetGroups("ChatTargetGroupAssoc", AddApplicationTargetGroupsProps.builder()
                .targetGroups(Collections.singletonList(targetGroup))
                .build());
    }

    private ApplicationLoadBalancer createApplicationLoadBalancer() {
        final var params = new FFApplicationLoadBalancer.LoadBalancerConfig().setLoadBalancerName("chat");
        final var alb = new FFApplicationLoadBalancer(this, "Default", params);
        return alb.getApplicationLoadBalancer();
    }

    private String createCnameRecord(final @NotNull String loadBalancerDnsName) {
        return new FFCnameRecord(this, "pete-cname",
                FFCnameRecord.CnameRecordParams.Builder.create()
                        .recordName("pete")
                        .domainName(loadBalancerDnsName)
                        .build()).getFullyQualifiedDomainName();
    }
}